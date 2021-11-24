// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
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


}
