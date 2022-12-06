import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from "App/Models/Document";
import FileUpload from "App/utils/fileUploader";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import is from "@sindresorhus/is";
import number = is.number;

export default class DocumentsController {
  public async index({params, view}: HttpContextContract) {

     // const fundc = await Fund.query().where('id',  params.resource_id)
      const Documents = await Document.query().where('resource_id', params.resource_id).andWhere('doc_type_id', params.doc_type_id)
      return view.render('maintenance/document', {Documents, resource_id: params.resource_id, doc_type_id: params.doc_type_id})
    }

  public async create({}: HttpContextContract) {}

  public async store({  request, response, auth, session}: HttpContextContract) {

    let dataUrl = ''
    let fileSize = number
    let fileExt: string | undefined = ''
    if (request.file('upload')) {
      // @ts-ignore
      const new_file = request.file('upload')

        // @ts-ignore
       try {
        const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
        dataUrl = data.url
        fileSize = (data.stats.size / (1024 * 1024)).toFixed(2)
        fileExt = data.extension
      }
      catch (error){
        console.log(error.original)
      }

      }

    const dataS = await this.validateInput(request)

    //console.log(dataS)

    // @ts-ignore
    await Document.create({
      name: dataS.name,
      doc_type_id : dataS.doc_type_id,
      resource_id : dataS.resource_id,
      url : dataUrl,
      // @ts-ignore
      created_by: auth.user.id,
      type : fileExt,
      // @ts-ignore
      size: fileSize

    })
    session.flash({notification: 'File Added'})
    return response.redirect('back')


  }

  public async show({}: HttpContextContract) {}

  public async edit({params, view}: HttpContextContract) {

    console.log('HERRO' )
    const doc = await Document.findOrFail(params.id)
    console.log(doc)
   return view.render('maintenance/document', {doc, resource_id: doc.resource_id})

  }

  public async update({request, params, session, response}: HttpContextContract) {

    const document = await Document.findOrFail( params.id)
    const data = await this.validateInput(request)

    document.merge({
      name: data.name,
    })

    await document.save()
    session.flash('notification', 'Document Saved.')
    return response.redirect().back()

  }
  public async destroy({params, session, response}: HttpContextContract) {
    const f = await Document.findOrFail(params.id)
    console.log(f)
    await FileUpload.DeleteFile(f.url)
    await f.delete()
    session.flash('notification', 'File deleted!')

    return response.redirect('back')

  }

  private async validateInput(request) {
    const valSchema = schema.create({
      name: schema.string({trim: true}, [rules.maxLength(150), rules.required()]),
      resource_id: schema.number( [rules.required()]),
      doc_type_id: schema.number([rules.required()])

    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'name.required': 'Name is required',
        'name.maxLength': 'Name allows upto 150 characters',
        'resource_id.required': 'Resource ID is required'
      },
    })
  }

}
