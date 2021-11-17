import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import CompanyContact from "App/Models/CompanyContact";

export default class CompanyContactsController {
  public async index ({ view }: HttpContextContract){
    return view.render('company_contact')
  }

}
