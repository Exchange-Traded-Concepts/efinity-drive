import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientContact from "App/Models/ClientContact";
import Client from "App/Models/Client";


export default class ClientContactsController {
  public async index({params, view}: HttpContextContract) {

    const clients = await Client.query();
    const clientContacts = await ClientContact.query()

    return view.render('maintenance/clientcontact', {client_id : params.client_id, clients, clientContacts})

  }

  public async client ({view, params}: HttpContextContract) {
    const clientContacts = await ClientContact.query().preload('client').where('client_id', params.client_id)
    return view.render('admin/client_contacts', {clientContacts, client_id: params.client_id})
  }


  public async create({}: HttpContextContract) {}

  public async store({request, session, response}: HttpContextContract) {
    //const data = await this.validateInput(request)
    await ClientContact.create({
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      clientId: request.input('client_id'),
      role: request.input('role'),
      email: request.input('email'),
      phone:request.input('phone'),
      secondary_phone: request.input('secondary_phone'),
      notes : request.input('notes'),

    })
    session.flash('notification', 'Contact saved.')
    return response.redirect().back()

  }

  public async show({view}: HttpContextContract) {
    const clientContacts = await ClientContact.query()
      .preload('client')
    return view.render('admin/client_contacts', {clientContacts})
  }

  public async edit({view, params}: HttpContextContract) {

    const cc = await ClientContact.findBy('id', params.id )
    const clients = await Client.query();
    const clientContacts = await ClientContact.query()
    // @ts-ignore
    let client_id = cc.clientId
    return view.render('maintenance/clientcontact', {cc, client_id, clients, clientContacts})
  }

  public async update({params, request, response, session}: HttpContextContract) {

    const c = await ClientContact.findOrFail( params.id)

    c.merge({
      first_name: request.input('first_name'),
      last_name: request.input('last_name'),
      clientId: request.input('client_id'),
      role: request.input('role'),
      email: request.input('email'),
      phone:request.input('phone'),
      secondary_phone: request.input('secondary_phone'),
      notes : request.input('notes'),
    })

    await c.save()
    session.flash('notification', 'Client Contact Updated')
    return response.redirect('back', )

  }

  public async destroy({}: HttpContextContract) {}


}
