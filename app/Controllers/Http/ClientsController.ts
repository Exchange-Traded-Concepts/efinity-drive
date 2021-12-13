import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Client from "App/Models/Client";
import FileUpload from "App/utils/fileUploader";
//import Database from "@ioc:Adonis/Lucid/Database";

export default class ClientsController {

  public async index ({ view, session }: HttpContextContract){

    //const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
    //  .orderBy('last_name')

    //const contacts = await CompanyContact.all();

    session.get('area_code')

    // Write value
    session.put('area_code', 777)
    return view.render('client/index')
  }
  public async store ({request, session, response}: HttpContextContract) {

    console.log(request.file('upload'))
    const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
    console.log(data.url)

    await Client.create({
    name : request.input('name'),
    address: request.input('address'),
    phone: request.input('phone'),
    logo_file:  data.url,
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


  public async show ({}: HttpContextContract) {
  }


  public async edit ({}: HttpContextContract) {
  }


  public async update ({}: HttpContextContract) {
  }


  public async destroy ({}: HttpContextContract) {
  }

}
