import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Client from "App/Models/Client";
import FileUpload from "App/utils/fileUploader";
import States from "App/utils/USState";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
//import Database from "@ioc:Adonis/Lucid/Database";

export default class ClientsController {

  public async index ({ view, session }: HttpContextContract){

    //const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
    //  .orderBy('last_name')

    const data = await Client.all();
    const states = await States.state_hash()
    const maint = 'show'

    session.get('area_code')
    // Write value
    session.put('area_code', 777)
    return view.render('client/index', {data, states, maint})
  }
  public async store ({request, session, response}: HttpContextContract) {

    let dataUrl = ''
    if (request.file('upload')) {
      console.log(request.file('upload'))
      const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
      console.log(data.url)
      dataUrl = data.url
    }

        await Client.create({
      name : request.input('name'),
      address: request.input('address'),
    //  city: request.input('city'),
    //  state: request.input('state'),
    //   zip: request.input('zip'),
      phone: request.input('phone'),
      logo_file:  dataUrl,
      primary_contact_name:   request.input('primary_contact_name'),
      primary_contact_phone:  request.input('primary_contact_phone'),
      primary_contact_email:   request.input('primary_contact_email'),
      website:   request.input('website'),
      etf_website:  request.input('etf_website'),
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
     // city: data.city,
     // state: data.state,
     // zip: data.zip,
      phone: request.input('phone'),
      primary_contact_name:   request.input('primary_contact_name'),
      primary_contact_phone:  request.input('primary_contact_phone'),
      primary_contact_email:   request.input('primary_contact_email'),
      website:   request.input('website'),
      etf_website:  request.input('etf_website'),
    })

     await c.save()
    session.flash('notification', 'Client Updated')
    return response.redirect('back', )

  }


  public async destroy ({}: HttpContextContract) {
  }

  private async validateInput(request) {
    const valSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      address: schema.string({trim: true}, [rules.maxLength(255)]),
     /* city: schema.string({trim: true}, [rules.maxLength(255)]),
      state: schema.string({trim: true}, [rules.maxLength(2)]),
      zip: schema.string({trim: true}, [rules.maxLength(10)]),
     */
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
