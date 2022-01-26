import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FundDocument from "App/Models/FundDocument";
import Fund from "App/Models/Fund";
import FileUpload from "App/utils/fileUploader";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class FundDocumentsController {
  public async index({params, view}: HttpContextContract) {

    const fundc = await Fund.query().where('id', params.fund_id)
    const FundDocuments = await FundDocument.query().preload('fund').where('fund_id', params.fund_id)
    return view.render('maintenance/fundDocument', {FundDocuments, fund_id: params.fund_id, fundc})
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response, auth, session}: HttpContextContract) {

    let dataUrl = ''
    let fileSize = 0
    let fileType: string | undefined = ''
    if (request.file('upload')) {
      const new_file = request.file('upload')

      // @ts-ignore
      console.log(new_file)
      const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
      //console.log(data)
      dataUrl = data.url
      fileSize = data.stats.size
      fileType = new_file?.type
    }

    const data = await this.validateInput(request)

    // @ts-ignore
    await FundDocument.create({
      name: data.name,
      fundId : data.fund_id,
      url : dataUrl,
      // @ts-ignore
      created_by: auth.user.id,
      type : fileType,
      // @ts-ignore
      size: fileSize

    })
    session.flash({notification: 'File Added'})
    return response.redirect('back')
  }

  private async validateInput(request) {
    const valSchema = schema.create({
      name: schema.string({trim: true}, [rules.maxLength(150), rules.required()]),
      fund_id: schema.string({trim: true}, [rules.required()])
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'name.required': 'Name is required',
        'name.maxLength': 'Name allows upto 150 characters',
        'fund_id.required': 'Fund is required'
      },
    })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({params, session, response}: HttpContextContract) {
    const f = await FundDocument.findOrFail(params.id)
    await FileUpload.DeleteFile(f.url)
    await f.delete()
    session.flash('notification', 'File deleted!')

    return response.redirect('back')

  }
}
