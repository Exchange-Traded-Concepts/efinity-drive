import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanyContact from "App/Models/CompanyContact";
import Inventory from "App/Models/Inventory";


export default class InventoriesController {
  public async index({view}: HttpContextContract) {
    const inv = await Inventory.query()
      .preload('assignedTo')
    return view.render('maintenance/inventory', {inv})
  }

  public async create({view}: HttpContextContract) {
    const emps = await CompanyContact.all();
    console.log(emps)
    return view.render('maintenance/inventory_form', {emps})
  }

  public async store({request, response, session}: HttpContextContract) {

    await Inventory.create({
      name: request.input('name'),
      assigned_to: request.input('assigned_to'),
      serial: request.input('serial'),
      type: request.input('type'),

    })
    session.flash('notification', 'Record saved.')
    return response.redirect().back()


  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
