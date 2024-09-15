import fs from "fs/promises";
export class ImageHelper {
  static saveImage(fileName: string, buffer: Buffer) {
    return fs.writeFile(`./public/images/${fileName}`, buffer);
  }
}