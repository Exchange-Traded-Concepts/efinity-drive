

import Event from '@ioc:Adonis/Core/Event'
import puppeteer from 'puppeteer'
import Drive from '@ioc:Adonis/Core/Drive'
import { string } from '@ioc:Adonis/Core/Helpers'
import FileUpload from 'App/utils/fileUploader'
import Invoice from "App/Models/Invoice";


interface SendInvoice {
  userId: string
  signedInvoicePath: string
}

Event.on('send:invoice', async ({ userId, signedInvoicePath }: SendInvoice) => {
    console.log("was in send invoice event")
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`http://localhost:3333${signedInvoicePath}`, { waitUntil: 'networkidle0' })
    await page.emulateMediaType('screen')
    const pdf = await page.pdf({ format: 'a4' })
    // uploadToS3Stream
    // Drive.put("test.pdf",pdf)
    try {
        const extname= "pdf"
        // TODO - this will generate a new file name each time,
        // do we need to use a fixed name and delete old one if exist
        const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const fileName = `${randomName}_${Date.now()}.${extname}`
        const contentType = 'application/pdf';
        const folder="uploads"
        const data = await FileUpload.uploadToS3Stream({buffer:pdf,contentType,fileName,extname,folder})
        console.log({data})
        const invoice = await Invoice.findOrFail(userId)
        invoice.merge({pdf_url: data.url})
        await invoice.save()
    }
    catch (error){
      console.log(error)
    }

})
