import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Distributor from "App/Models/Distributor";
import States from "App/utils/USState";
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class DistributorsController {
  public async index({ view }: HttpContextContract) {

    const data = await Distributor.all()

    const states = await States.state_hash()

    return view.render('maintenance/distributor', {data, states})

  }

  public async create({}: HttpContextContract) {}

  public async store({request, response, session}: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({trim: true}, [rules.maxLength(255)]),
      address: schema.string({trim: true}, [rules.maxLength(255)]),
      city: schema.string({trim: true}, [rules.maxLength(255)]),
      state: schema.string({trim: true}, [rules.maxLength(2)]),
      zip: schema.string({trim: true}, [rules.maxLength(10)]),
      }
    )

    const validatedData = await request.validate({schema: validationSchema,
      messages : {
        'name.required': 'Enter Distributor Name',
        'name.maxlength': 'Name cannot Exceed 255 characters',
        'address.maxlength': 'Address cannot Exceed 255 characters',
      }
    })

    await Distributor.create({
      name: validatedData.name,
      address: validatedData.address,
      city: validatedData.city,
      state: validatedData.state,
      zip: validatedData.zip,
    })

    session.flash('notification', 'Distributor Added')

    return response.redirect('back')
  }

  public async show({}: HttpContextContract) {}

  public async edit({  params, view}: HttpContextContract) {
    const dist =    await Distributor.findBy('id',params.id)
    const states =  await States.state_hash()
    const data =    await Distributor.all()
    return view.render('maintenance/distributor', { dist: dist, states, data})
  }

  public async update({params, request, response, session}: HttpContextContract) {

    const distributor = await Distributor.findOrFail( params.id)

    distributor.merge({
        name: request.input('name'),
        address: request.input('address'),
        city: request.input('city'),
        state: request.input('state'),
        zip: request.input('zip')
    })

    await distributor.save()
    session.flash('notification', 'Distributor Updated')
    return response.redirect('back')

  }

  public async destroy({}: HttpContextContract) {}
}
