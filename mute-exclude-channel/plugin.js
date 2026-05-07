(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region solid-js
var require_solid_js = __commonJS({ "solid-js"(exports, module) {
	module.exports = shelter.solid;
} });

//#endregion
//#region plugins/mute-exclude-channel/index.jsx
var import_web = __toESM(require_web(), 1);
var import_web$1 = __toESM(require_web(), 1);
var import_web$2 = __toESM(require_web(), 1);
var import_web$3 = __toESM(require_web(), 1);
var import_web$4 = __toESM(require_web(), 1);
var import_web$5 = __toESM(require_web(), 1);
var import_solid_js = __toESM(require_solid_js(), 1);
const _tmpl$ = /*#__PURE__*/ (0, import_web.template)(`<div><!#><!/><!#><!/></div>`, 6);
const { plugin: { store }, solid: { createSignal } } = shelter;
const { TextBox, Button, ButtonSizes, Divider, Header, HeaderTags, Text, TextTags } = shelter.ui;
const { GuildStore, ChannelStore, UserGuildSettingsStore } = shelter.flux.storesFlat;
function updateChannels(data) {
	setChannels({ ...data });
	store.exemptedChannels = { ...data };
	exemptedSet.clear();
	for (const ids of Object.values(data)) ids.forEach((id) => exemptedSet.add(id));
}
let unpatch;
const [channels, setChannels] = createSignal({});
const exemptedSet = new Set();
function removeChannel(guildId, channelId) {
	const data = { ...channels() };
	data[guildId] = data[guildId].filter((id) => id !== channelId);
	if (data[guildId].length === 0) delete data[guildId];
	updateChannels(data);
}
function onLoad() {
	console.log("raw store value:", store.exemptedChannels);
	store.exemptedChannels ??= {};
	console.log("after init:", store.exemptedChannels);
	const data = { ...store.exemptedChannels };
	setChannels(data);
	for (const ids of Object.values(data)) ids.forEach((id) => exemptedSet.add(id));
	unpatch = shelter.patcher.after(
		"isGuildOrCategoryOrChannelMuted",
		// From 938005
		UserGuildSettingsStore.__proto__,
		// Flux object's prototype
		([guildId, channelId], ret) => {
			if (ret === false) return;
			if (exemptedSet.has(channelId)) return false;
		}
);
}
function onUnload() {
	unpatch?.();
}
const settings = () => {
	const [inputValue, setInputValue] = createSignal("");
	function addChannel() {
		const parts = inputValue().trim().split("/");
		const [channelId, guildId] = parts.slice(-2).reverse();
		if (!channelId || !guildId) return;
		const data = { ...channels() };
		data[guildId] ??= [];
		if (!data[guildId].includes(channelId)) data[guildId].push(channelId);
		updateChannels(data);
		setInputValue("");
	}
	return [
		(0, import_web$5.createComponent)(TextBox, {
			get value() {
				return inputValue();
			},
			placeholder: "Channel Link",
			id: "channelId",
			onInput: setInputValue
		}),
		(0, import_web$5.createComponent)(Button, {
			style: { margin: "0.5rem 0" },
			onClick: addChannel,
			children: "Add"
		}),
		(0, import_web$5.createComponent)(Divider, { style: { margin: "1rem 0" } }),
		(0, import_web$5.createComponent)(import_solid_js.For, {
			get each() {
				return Object.entries(channels());
			},
			children: ([guildId, channelIds]) => [
				(0, import_web$5.createComponent)(Header, {
					get tag() {
						return HeaderTags.HeadingLG;
					},
					get children() {
						return GuildStore.getGuild(guildId)?.name ?? guildId;
					}
				}),
				(0, import_web$5.createComponent)(import_solid_js.For, {
					each: channelIds,
					children: (channelId) => (() => {
						const _el$ = (0, import_web$1.getNextElement)(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = (0, import_web$2.getNextMarker)(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = (0, import_web$2.getNextMarker)(_el$4.nextSibling);
						_el$.style.setProperty("margin", "0.25rem 0");
						_el$.style.setProperty("display", "flex");
						_el$.style.setProperty("align-items", "center");
						_el$.style.setProperty("justify-content", "space-between");
						(0, import_web$3.insert)(_el$, (0, import_web$5.createComponent)(Text, {
							get tag() {
								return TextTags.textMD;
							},
							get children() {
								return ["#", (0, import_web$4.memo)(() => ChannelStore.getChannel(channelId)?.name ?? channelId)];
							}
						}), _el$3, _co$);
						(0, import_web$3.insert)(_el$, (0, import_web$5.createComponent)(Button, {
							get size() {
								return ButtonSizes.MIN;
							},
							onClick: () => removeChannel(guildId, channelId),
							children: "Remove"
						}), _el$5, _co$2);
						return _el$;
					})()
				}),
				(0, import_web$5.createComponent)(Divider, { style: { margin: "1rem 0" } })
			]
		})
	];
};

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});