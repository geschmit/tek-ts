# tek-ts: Tektronix 4014 Graphics Emulator

This is a TypeScript library for procedurally generating Tektronix graphics commands for physical or emulated Tektronix 4014 + EGM terminals(xterm, Tek4010).

## Example
```ts
// Using Bun with tek-ts
import {Tek_Clear,Tek_SetPen,Tek_Goto,Tek_Text,Tek_RenderHPGL} from "tek-ts"
import {file} from "bun"

// Draw a box
Tek_Clear()       // Clear terminal
Tek_SetPen(false) // Lift pen
Tek_Goto(0,0)     // Go to coord 0,0
Tek_SetPen(true)  // Drop pen

Tek_Goto(500,0)   // Go to coord 500,0
Tek_Goto(500,500) //             500,500
Tek_Goto(0,500)   //               0,500
Tek_Goto(0,0)     //               0,0

// Write some text
for (let i=0; i<5; i++) {
    Tek_Text("Hello world!",1000,1000+(100*i),i) // Text to draw, X, Y, size of text
}

// Render HP-GL graphics commands
Tek_RenderHPGL(await Bun.file("./media/Stolas.hpgl").text())
```

## Install
```bash
# bun
bun i git+https://github.com/geschmit/tek-ts.git

# npm
npm i git+https://github.com/geschmit/tek-ts.git
```

## TODO
- Implement line type selection

## License
Licensed under the Apache 2.0 software license.