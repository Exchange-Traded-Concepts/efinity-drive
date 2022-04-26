import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from "App/Models/Client";

export default class ClientUsersController {
  public async index({view}: HttpContextContract) {

    const clients = await Client.all()

    return view.render('maintenance/client_user', {clients})

  }
  public async create({request}: HttpContextContract) {



    let x = request.input('client_id')


      for(let i = 0 ; i < x.length; i++ ){
        console.log(x[i])
      }




  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
