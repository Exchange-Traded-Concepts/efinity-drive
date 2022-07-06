import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from "App/Models/Document";
import FileUpload from "App/utils/fileUploader";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class DocumentsController {
  public async index({params, view}: HttpContextContract) {

     // const fundc = await Fund.query().where('id',  params.resource_id)
      const Documents = await Document.query().where('resource_id', params.resource_id).andWhere('doc_type_id', params.doc_type_id)
      return view.render('maintenance/document', {Documents, resource_id: params.resource_id, doc_type_id: params.doc_type_id})
    }

  public async create({}: HttpContextContract) {}

  public async store({ /* request, response, auth, session,*/ view}: HttpContextContract) {

    console.log('INSIDE STORE')
    return view.render('maintenance/fund');
    /*

    let dataUrl = ''
    let fileSize = 0
    let fileType: string | undefined = ''
    if (request.file('upload')) {
      const new_file = request.file('upload')

      try {
        // @ts-ignore
        // console.log(new_file)
        const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
        //console.log(data)
        dataUrl = data.url
        fileSize = data.stats.size
        fileType = new_file?.type
      }
      catch (e) {
        console.log(e)
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
      type : fileType,
      // @ts-ignore
      size: fileSize

    })
    session.flash({notification: 'File Added'})
    return response.redirect('back')

     */
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({params, session, response}: HttpContextContract) {
    const f = await Document.findOrFail(params.id)
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
