import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanyContact from "App/Models/CompanyContact";
import Database from "@ioc:Adonis/Lucid/Database";
//import FileUpload from "App/utils/fileUploader";



export default class CompanyContactsController {

  public async show({view}: HttpContextContract){
    const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
      .orderBy('last_name')
    return view.render('admin/company2', {contacts})
  }

  public async index ({ view, session, auth }: HttpContextContract){

   const contacts = await Database.query().from('company_contacts').select('*').orderBy('office_location', 'desc')
     .orderBy('last_name')

    //const contacts = await CompanyContact.all();

    console.log(auth.user)

    session.get('area_code')

    // Write value
    session.put('area_code', 777)
    const maint = 'show'
    return view.render('company_contact', {contacts, maint})
  }

  public async store ({request, session, response} : HttpContextContract ){

  /*  console.log(request.file('upload'))
    const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
    console.log(data.url)


   */
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


  public async edit({ params, view}: HttpContextContract) {
    const contact =    await CompanyContact.findBy('id',params.id)
    const contacts =    await CompanyContact.all()
    return view.render('company_contact', { contact, contacts, maint: 'show'})

  }

  public async update({params, request, session, view}: HttpContextContract) {

    const companyContact = await CompanyContact.findOrFail( params.id)

    //const data = await this.validateInput(request)

    companyContact.merge({
      first_name : request.input('first_name'),
      last_name : request.input('last_name'),
      job_title : request.input('job_title'),
      email : request.input('email'),
      office_phone : request.input('office_phone'),
      other_phone: request.input('other_phone'),
      office_location: request.input('office_location'),
    })

    await companyContact.save()
    session.flash('notification', 'Contact Updated')

    //const contacts = await CompanyContact.all()
    const contacts = await CompanyContact.query().orderBy('office_location')
    const maint = 'show'
    return view.render('company_contact', {  contacts, maint })

  }


  public async destroy({params, session, response}: HttpContextContract) {
    const contact = await CompanyContact.findOrFail(params.id)
    await contact.delete()
    session.flash('notification', 'Contact deleted!')

    return response.redirect('back')

  }

}
