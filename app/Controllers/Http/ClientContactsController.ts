import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientContact from "App/Models/ClientContact";
import Client from "App/Models/Client";


export default class ClientContactsController {
  public async index({params, view}: HttpContextContract) {

    const clients = await Client.query();
    const clientContacts = await ClientContact.query()

    return view.render('maintenance/clientcontact', {client_id : params.client_id, clients, clientContacts})

  }

  public async create({}: HttpContextContract) {}

  public async store({request, session, response}: HttpContextContract) {
    //const data = await this.validateInput(request)
    await ClientContact.create({
      first_name: request.input('name'),
      last_name: request.input('name'),
      clientId: request.input('client_id'),
      role: request.input('role'),
      email: request.input('email'),
      phone:request.input('phone'),
      secondary_email: request.input('secondary_email'),
      notes : request.input('notes')

    })
    session.flash('notification', 'Contact saved.')
    return response.redirect().back()

  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}


}
