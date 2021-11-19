import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactValidator from "App/Validators/ContactValidator";
//import session from "Config/session";
import CompanyContact from "App/Models/CompanyContact";

export default class CompanyContactsController {
  public async index ({ view, session }: HttpContextContract){
    session.get('area_code')

    // Write value
    session.put('area_code', 777)
    return view.render('company_contact')
  }

  public async store ({request, session, response } : HttpContextContract ){
    const data = await request.validate(ContactValidator)

    await CompanyContact.create(data)

    session.flash({notification: 'Contact Added'})
    return response.redirect('back')
  }

}
