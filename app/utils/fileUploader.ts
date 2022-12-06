import path from 'path';
import Drive from '@ioc:Adonis/Core/Drive';
//import Application from '@ioc:Adonis/Core/Application'
import {createReadStream,ReadStream} from 'fs';
import * as console from "console";
export default class FileUpload {

  // @ts-ignore
  static async stream2buffer(stream: ReadStream): Promise<Buffer> {

      return new Promise<Buffer>((resolve, reject) => {

        const _buf = Array<any>();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

      });
    }

  static async uploadToS3 (file, folder, oldPath) {
    // If oldPath parameter is set then, delete the old picture
    //console.log({file})
    if (oldPath) {
      const exists = await Drive.use('s3').exists(oldPath)
      if (exists) {
        await Drive.use('s3').delete(oldPath)
      }
    }

    // Create a random name for file
    const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const fileName = `${randomName}_${Date.now()}.${file.extname}`

   // console.log(randomName)
   // console.log(fileName)

    // Sets the path and move the file
    const filePath = `${path.resolve(`./tmp/${folder}`)}/${fileName}`
    //console.log(filePath)
    //console.log(Application.tmpPath(folder),"=======>",path.resolve(`./tmp/${folder}`))
    try {
      // Application.tmpPath('uploads')
      // '/root/efinity/tmp/uploads'
      await file.move('./tmp/uploads', { name: fileName, overwrite: true })
    }
    catch (e) {
      console.log(e.original)
    }

    // Creates a readable stream from file and stores its size
    const fileStream = createReadStream(filePath)
    // const fileSize = file.size
    const buffers = await this.stream2buffer(fileStream)
    // Uploads the file to Amazon S3 and stores the url
    const s3Path = `${folder}/${fileName}`

    try {
      await Drive.use('s3').put(s3Path, buffers, {ACL: 'public-read', ContentType: `${file.type}/${file.subtype}`})

      console.log(file.extname)

    }
    catch (e){
      console.log(e.original)
    }
    const fileUrl = await Drive.use('s3').getUrl(s3Path)
    const fileStats = await Drive.use('s3').getStats(s3Path)
    const contents = await Drive.use('s3').get(s3Path)
    // Destroy the readable stream and delete the file from tmp path
    await fileStream.destroy()
    await Drive.delete(filePath)

    return {
      name: fileName,
      path: s3Path,
      stats: fileStats,
      url: fileUrl,
      extension: file.extname,
      ext:contents,
    }
  }

  static async DeleteFile(filePath){
   // console.log(filePath)
    await Drive.use('s3').delete(filePath)
  }

}
