import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from "App/Models/Client";
import users from "App/Models/users";
import Database from "@ioc:Adonis/Lucid/Database";

export default class UserClientsController {
  public async index({view, params}: HttpContextContract) {

    // @ts-ignore
    const clientUsers = await users.query().where('is_admin', 0)
    const clients = await Client.all()
    const user = params.id
    const currentSelections =  await Database.rawQuery('SELECT client_id FROM user_clients WHERE user_id = ?', [params.id])
    console.log(currentSelections[0])
    return view.render('maintenance/user_clients', {clientUsers, clients, user, currentSelections})
  }

  public async create({}: HttpContextContract) {}

  public async store({request, session, response}: HttpContextContract) {

    const user_id = request.input('user_id')
    const clients  = request.input('client_id')
    await Database.rawQuery('DELETE FROM user_clients where user_id = ?', [user_id])

    if(clients) {
      for (let i = 0; i < clients.length; i++) {
        await Database.rawQuery('INSERT INTO user_clients(`user_id`  , `client_id` ) values(?, ?)', [user_id, clients[i]])
      }
    }
    session.flash({notification: 'User Client Access Updated'})
    return response.redirect('back')

  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
