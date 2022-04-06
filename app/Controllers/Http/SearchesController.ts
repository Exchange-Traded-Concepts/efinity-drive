import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientContact from "App/Models/ClientContact";
import Fund from "App/Models/Fund";
import Task from "App/Models/Task";
import Client from "App/Models/Client";


export default class SearchesController {
  public async index({request, response, view}: HttpContextContract) {

    let search = request.input('search').trim()

    const fund = await Fund.query().where('ticker', search)

    if (fund.length> 0){
      let id = fund[0].id
      return  response.redirect().toRoute('FundsController.details', {id: id})
    }

    const contacts = await ClientContact.query().where('first_name', 'LIKE', '%'+search+'%')
      .orWhere('last_name', 'LIKE', '%'+search+'%')
      .orWhere('email', 'LIKE', '%'+search+'%')
      .preload('client')

    const funds = await Fund.query().where('ticker', 'LIKE' , '%'+search+'%')
      .orWhere('fund_name', 'LIKE', '%'+search+'%')
      .preload('custodian')
      .preload('distributor')

    const tasks = await Task.query().where('title', 'LIKE', '%'+search+'%')
      .orWhere('description', 'LIKE', '%'+search+'%')
      .preload('subtasks')
      .preload('createdBy')
      .preload('assignedTo')

    const clients = await Client.query().where('name', 'LIKE', '%'+search+'%')
      .orWhere('address', 'LIKE', '%'+search+'%')

    return view.render('admin/search', {contacts, funds, tasks, clients, search})

  }


  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
