import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Client from "App/Models/Client";
import FileUpload from "App/utils/fileUploader";
import States from "App/utils/USState";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class ClientsController {

  public async index ({ view, session }: HttpContextContract){

    //const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
    //  .orderBy('last_name')

    const data = await Client.query().orderBy('name');
    const states = await States.state_hash()
    const maint = 'show'

    session.get('area_code')
    // Write value
    session.put('area_code', 777)
    return view.render('client/index', {data, states, maint})
  }
  public async store ({request, session, response}: HttpContextContract) {
  console.log('IN LOG')

    let dataUrl = ''
    if (request.file('upload')) {
      console.log(request.file('upload'))
      const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
      console.log(data.url)
      dataUrl = data.url
    }

    console.log('I Bet that data url is null')

    const data = await this.validateInput(request)

    console.log(data)

    await Client.create({
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      phone: data.phone,
      country: data.country,
      logo_file:  dataUrl,
      primary_contact_name:   data.primary_contact_name,
      primary_contact_phone:  data.primary_contact_phone,
      primary_contact_email:   data.primary_contact_email,
      website:   data.website,
      etf_website:  data.etf_website,

    })

    session.flash({notification: 'Client Added'})
    return response.redirect('back')

  }


  public async create ({}: HttpContextContract) {
  }


  public async show ({view}: HttpContextContract) {
    const clients = await Client.all()
    return view.render('admin/clients', {clients})
  }


  public async edit ({view, params}: HttpContextContract) {

    const client =    await Client.findBy('id',params.id)
    const states =  await States.state_hash()
    const data =    await Client.all()
    const maint = 'show'
    return view.render('client/index', { client: client, states, data, maint})

  }


  public async update ({ params, request, response, session  }: HttpContextContract) {

    const c = await Client.findOrFail( params.id)

    const data = await this.validateInput(request)

    c.merge({
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      phone: data.phone,
      primary_contact_role: data.primary_contact_role,
      primary_contact_name:   data.primary_contact_name,
      primary_contact_phone:  data.primary_contact_phone,
      primary_contact_email:  data.primary_contact_email,
      website:  data.website,
      etf_website:  data.etf_website,
    })

     await c.save()
    session.flash('notification', 'Client Updated')
    return response.redirect('back', )

  }

  public async details({view, params }: HttpContextContract){
    const data = await Client.query().preload('funds').preload('clientContacts').where('id', params.client_id)
    return view.render('admin/client_details', {data})
  }


  public async destroy ({}: HttpContextContract) {
  }

  private async validateInput(request) {

    const valSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      address: schema.string.optional({trim: true}, [rules.maxLength(255)]),
      city: schema.string.optional({trim: true}, [rules.maxLength(255)]),
      state: schema.string({trim: true}, [rules.maxLength(3)]),
      zip: schema.string.optional({trim: true}, [rules.maxLength(10)]),
      primary_contact_role: schema.string.optional({trim:true}, [rules.maxLength(200)]),
      primary_contact_name: schema.string.optional({trim: true}, [rules.maxLength(200)]),
      primary_contact_phone: schema.string.optional({trim: true}, [rules.maxLength(20)]),
      primary_contact_email: schema.string.optional({trim: true}, [rules.maxLength(150), rules.email()]),
      country: schema.string.optional({trim: true}, [rules.maxLength(150)]),
      website: schema.string.optional({trim: true}, [rules.maxLength(150)]),
      etf_website : schema.string.optional({trim: true}, [rules.maxLength(150)])
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
