import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Client from "App/Models/Client";
import FileUpload from "App/utils/fileUploader";
import States from "App/utils/USState";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Fund from "App/Models/Fund";
import ClientContact from "App/Models/ClientContact";

export default class ClientsController {

  public async index ({ view, session, params }: HttpContextContract){

    //const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
    //  .orderBy('last_name')

    const data = await Client.query().where('client_type_id', params.client_type_id).orderBy('name');
    const states = await States.state_hash()
    const maint = 'show'

    const client_type = {1: "client", 2: "distributor", 3: "custodian", 4:"vendor"}

    console.log(client_type[1])

    session.get('area_code')
    // Write value
    session.put('area_code', 777)
    return view.render('client/index', {data, states, maint, client_type_id : params.client_type_id, type: client_type[params.client_type_id]})
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
      website:   data.website,
      client_type_id:  data.client_type_id,
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

  public async clients ({view}: HttpContextContract) {
    const clients = await Client.query().where('client_type_id', 1)
    return view.render('admin/clients', {clients, client_type_id: 1})
  }

  public async distributor ({view}: HttpContextContract) {
    const clients = await Client.query().where('client_type_id', 2)
    return view.render('admin/clients', {clients, client_type_id: 2})
  }

  public async custodian ({view}: HttpContextContract) {
    const clients = await Client.query().where('client_type_id', 3)
    return view.render('admin/clients', {clients, client_type_id: 3})
  }

  public async vendor ({view}: HttpContextContract) {
    const clients = await Client.query().where('client_type_id', 4)
    return view.render('admin/clients', {clients, client_type_id: 4})
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
      website:  data.website,
      client_type_id:  data.client_type_id,
    })

     await c.save()
    session.flash('notification', 'Client Updated')
    return response.redirect('back', )

  }

  public async details({view, params }: HttpContextContract){
    const data = await Client.query()
      .preload('funds')
      .preload('clientContacts')
      .where('id', params.client_id)

    const funds = await Fund.query()
      .preload('custodian')
      .preload('distributor')
      .where('client_id', params.client_id)

    const contacts = ClientContact.query().where('client_id', params.client_id)
    return view.render('admin/client_details', {data, funds, contacts})
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
      country: schema.string.optional({trim: true}, [rules.maxLength(150)]),
      website: schema.string.optional({trim: true}, [rules.maxLength(150)]),
     client_type_id:schema.number.optional()
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
