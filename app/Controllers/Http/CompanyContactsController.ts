import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import ContactValidator from "App/Validators/ContactValidator";
//import session from "Config/session";
import CompanyContact from "App/Models/CompanyContact";
import Database from "@ioc:Adonis/Lucid/Database";
import FileUpload from 'App/utils/fileUploader';

export default class CompanyContactsController {
  public async index ({ view, session }: HttpContextContract){

   const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
     .orderBy('last_name')

    //const contacts = await CompanyContact.all();

    session.get('area_code')

    // Write value
    session.put('area_code', 777)
    return view.render('company_contact', {contacts})
  }

  public async store ({request, session, response} : HttpContextContract ){
    console.log(request.file('upload'));
    const data = await FileUpload.uploadToS3(request.file('upload'),'uploads',null);
    console.log({data});
    await CompanyContact.create({
      first_name : request.input('first_name'),
      last_name : request.input('last_name'),
      job_title : request.input('job_title'),
      email : request.input('email'),
      office_phone : request.input('office_phone'),
      other_phone: request.input('other_phone'),
      office_location: request.input('office_location'),
    })

    session.flash({notification: 'Contact Added'})
    return response.redirect('back')

  }

}
