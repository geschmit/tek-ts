
// We are emulating a Tektronix 4014 w/ EGM, for a resolution of 4096x3120

const FIVEBITS = 0x1f
const TWOBITS = 0x03

// Tek_VectorToText: Ported from release 2.6 of GNU libplot
export const Tek_VectorToTek = (x:number,y:number):string => {
  //process.stderr.write(`x: ${x}, y: ${y}\n`)
  const x_high = (x>>7) & FIVEBITS
  const y_high = (y>>7) & FIVEBITS
  const x_low =  (x>>2) & FIVEBITS
  const y_low =  (y>>2) & FIVEBITS
  const x_topsig = x & TWOBITS
  const y_topsig = y & TWOBITS
  const egm = (y_topsig<<2) + x_topsig

  const byte_buf = Buffer.alloc(5)
  let num_bytes = 0

  byte_buf[num_bytes++] = y_high | 0x20; 
  byte_buf[num_bytes++] =    egm | 0x60;
  byte_buf[num_bytes++] = y_low  | 0x60;
  byte_buf[num_bytes++] = x_high | 0x20;
  byte_buf[num_bytes++] = x_low  | 0x40;

  return byte_buf.toString()
}

export const Tek_Clear = () => process.stdout.write("\x1b\x0c")
export const Tek_SetPen = (down:boolean) => process.stdout.write(`${down == false ? "\x1b" : ""}\x1d`)
export const Tek_Goto = (x:number,y:number) => process.stdout.write(Tek_VectorToTek(x,y))
export const Tek_Text = (text:string,x:number,y:number,size:number=0) => {
  Tek_SetPen(false)
  Tek_Goto(x,y)
  process.stdout.write(`\x1b\x1f\x1b${String.fromCharCode(56+size)}${text}`)
}

export const Tek_RenderHPGL = (eq:string):void => {
  process.stdout.write("\x1b\x1d")
  for (const x of eq.split(";")) {
    switch (x.slice(0,2)) {
      case "PU":
        if (x.length <= 2) {
          continue
        }
        Tek_SetPen(false)
        let pos = [0,0]
        x.slice(2,x.length).split(",").map(
          (val,idx)=> {
            pos[idx] = parseInt(val)
          }
        )
        Tek_Goto(pos[0],pos[1])
        break;
      case "PD":
        Tek_SetPen(true)
        let buffer:Array<number> = []
        for (const y of x.slice(2,x.length).split(",")) {
          if (buffer.length == 2) {
            Tek_Goto(buffer[0],buffer[1])
            buffer = []
          }
          buffer.push(parseInt(y))
        } 
        break;
      default:
        break;
    }
  }
}