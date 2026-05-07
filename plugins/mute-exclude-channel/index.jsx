import { For } from "solid-js";

const {
  //util: { log },
  plugin: { store },
  solid: { createSignal },
} = shelter;
const {
  TextBox,
  Button,
  ButtonSizes,
  Divider,
  Header,
  HeaderTags,
  Text,
  TextTags,
} = shelter.ui;
const { GuildStore, ChannelStore, UserGuildSettingsStore } =
  shelter.flux.storesFlat;

function updateChannels(data) {
  setChannels({ ...data });
  // Store persistently
  store.exemptedChannels = { ...data };
  exemptedSet.clear();
  for (const ids of Object.values(data))
    ids.forEach((id) => exemptedSet.add(id));
}

let unpatch;
const [channels, setChannels] = createSignal({});
const exemptedSet = new Set();

function removeChannel(guildId, channelId) {
  const data = { ...channels() }; // Get state from above Signal
  // Filter and extract
  data[guildId] = data[guildId].filter((id) => id !== channelId);
  // Remove empty array
  if (data[guildId].length === 0) delete data[guildId];
  updateChannels(data);
}

export function onLoad() {
  //store.exemptedChannels = {};
  store.exemptedChannels ??= {};
  const data = { ...store.exemptedChannels };
  setChannels(data);
  for (const ids of Object.values(data))
    ids.forEach((id) => exemptedSet.add(id));

  // https://shelter.uwu.network/guides/patterns#store-patching
  unpatch = shelter.patcher.after(
    "isGuildOrCategoryOrChannelMuted", // From 938005
    UserGuildSettingsStore.__proto__, // Flux object's prototype
    ([guildId, channelId], ret) => {
      if (ret === false) return;
      // If array's values is in exemptedSet, set as false so they're not muted anymore
      if (exemptedSet.has(channelId)) return false;
    },
  );
}

export function onUnload() {
  unpatch?.();
}

export const settings = () => {
  const [inputValue, setInputValue] = createSignal("");

  function addChannel() {
    const parts = inputValue().trim().split("/");
    // Slice URL to get guildId and channelId
    const [channelId, guildId] = parts.slice(-2).reverse();
    if (!channelId || !guildId) return;
    const data = { ...channels() }; // Get state from above Signal
    data[guildId] ??= [];
    if (!data[guildId].includes(channelId)) data[guildId].push(channelId);
    updateChannels(data);
    setInputValue("");
  }

  return (
    <>
      <TextBox
        value={inputValue()}
        placeholder="Channel Link"
        id="channelId"
        onInput={setInputValue}
      />
      <Button style={{ margin: "0.5rem 0" }} onClick={addChannel}>
        Add
      </Button>
      <Divider style={{ margin: "1rem 0" }} />
      <For each={Object.entries(channels())}>
        {([guildId, channelIds]) => (
          <>
            <Header tag={HeaderTags.HeadingLG}>
              {GuildStore.getGuild(guildId)?.name ?? guildId}
            </Header>
            <For each={channelIds}>
              {(channelId) => (
                <div
                  style={{
                    margin: "0.25rem 0",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "space-between",
                  }}
                >
                  <Text tag={TextTags.textMD}>
                    #{ChannelStore.getChannel(channelId)?.name ?? channelId}
                  </Text>
                  <Button
                    size={ButtonSizes.MIN}
                    onClick={() => removeChannel(guildId, channelId)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </For>
            <Divider style={{ margin: "1rem 0" }} />
          </>
        )}
      </For>
    </>
  );
};
