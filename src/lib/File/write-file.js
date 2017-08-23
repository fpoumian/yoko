import fs from "fs"
import type { IFile } from "./interfaces"

export default function(file: IFile, data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file.getPath(), data, "utf8", err => {
      if (err) {
        reject(err)
      } else {
        resolve(file.getPath())
      }
    })
  })
}
