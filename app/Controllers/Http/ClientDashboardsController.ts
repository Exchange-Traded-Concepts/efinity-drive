import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from "App/Models/Client";
import Fund from "App/Models/Fund";


export default class ClientDashboardsController {
  public async index({session, view}: HttpContextContract) {
    if(session.get('user_clients')){

      const clients = await Client.query().whereIn('id', session.get('user_clients'))
      const funds = await Fund.query().preload('client').whereIn('client_id', session.get('user_clients'))

      return view.render('client/dashboard', {clients, funds})
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
