Command-line interface for controlling [WiZ™](//www.wizconnected.com) devices eg. smart bulbs. 

Needs to be run from the same network the device is connected to.

## USAGE

For now, `wizctl` can be run from the console like so:
```
npx vp2177/wizctl {Command} {Argument(s)} {IP}
```

You will need to have [Node.js](//nodejs.org) installed.

## COMMANDS

- `on`: Switch the device on
- `off`: Switch off
- `scene`: Switch to scene specified as the argument
- `status`: Query device status
- `rgb`: Set color. Syntax is `R,G,B`
- `scenes`: List available scenes
<!-- TODO `discover` --> 


