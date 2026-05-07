# zzzealed's shelter plugins

## Plugins

### [Hello World](./plugins/hello-world)
```
https://zzzealed.github.io/shelter-plugins/hello-world
```
My best work, some might say.

### [Mute Exclude Channel](./plugins/mute-exclude-channel)
```
https://zzzealed.github.io/shelter-plugins/mute-exclude-channel
```
Exclude individual channels from the global 'Mute Server'.

## Developing
0. Install `pnpm` or use `nix-shell`
1. Install dependencies: `pnpm i`
2. Run dev: `pnpm lune dev plugins/<plugin>`
3. Enable Shelter's `Lune Dev Mode` inside your client
4. Build: `pnpm lune ci`

## TODO
### Mute Exclude Channel
- [ ] Make "Unmute" button in channel context menu
- [x] Ensure channels are saved \
(hopefully works now)
- [ ] Allow adding Channels by ID
