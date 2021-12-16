import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from "@ioc:Adonis/Core/Validator";
import States from "App/utils/USState";
import Custodian from "App/Models/Custodian";

export default class CustodiansController {
  public async index({ view }: HttpContextContract) {
    const data = await Custodian.all()

    const states = await States.state_hash()

    return view.render('maintenance/custodian', {data, states})

  }

  public async create({}: HttpContextContract) {


  }

  public async store({request, response, session}: HttpContextContract) {

    const data = await this.validateInput(request)
     await Custodian.create({
       name: data.name,
       address: data.address,
       city: data.city,
       state:data.state,
       zip: data.zip,

     })
    session.flash('notification', 'Custodian saved.')
    return response.redirect().back()
  }

  public async show({}: HttpContextContract) {
  }

  public async edit({ params, view}: HttpContextContract) {
    const custo =    await Custodian.findBy('id',params.id)
    const states =  await States.state_hash()
    const data =    await Custodian.all()
    return view.render('maintenance/custodian', { custo, states, data})

  }

  public async update({params, request, response, session}: HttpContextContract) {

    const custodian = await Custodian.findOrFail( params.id)

    const data = await this.validateInput(request)

    custodian.merge({
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip
    })

    await custodian.save()
    session.flash('notification', 'Custodian Updated')
    return response.redirect('back')


  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      address: schema.string({trim: true}, [rules.maxLength(255)]),
      city: schema.string({trim: true}, [rules.maxLength(255)]),
      state: schema.string({trim: true}, [rules.maxLength(2)]),
      zip: schema.string({trim: true}, [rules.maxLength(10)]),
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'name.required': 'Name is required',
        'name.maxLength': 'Name allows upto 150 characters',
      },
    })
  }
}
