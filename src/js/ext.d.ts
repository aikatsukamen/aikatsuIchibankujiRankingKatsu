declare module 'canvas' {
  import * as Stream from 'stream';

  interface PNGOptions {
    palette: Uint8ClampedArray;
    backgroundIndex?: number;
  }

  interface JPEGOptions {
    bufsize?: number;
    quality?: number;
    progressive?: boolean;
    disableChromaSubsampling?: boolean;
  }

  interface Canvas extends HTMLCanvasElement {
    inspect(): string;
    toBuffer(): any;
    pngStream(options?: PNGOptions): Stream.Readable;
    jpegStream(options?: JPEGOptions): Stream.Readable;
    // pdfStream(): Stream.Readable;
  }

  interface Image extends HTMLImageElement {
    inspect(): string;
  }

  interface FontFace {
    family: string;
    weight?: string;
    style?: string;
  }

  function registerFont(src: string, fontFace: FontFace): any;
  function createCanvas(width: number, height: number, type?: any): Canvas;
  function loadImage(src: string | Buffer): Promise<Image>;
}
