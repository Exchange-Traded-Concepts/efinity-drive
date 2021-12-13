import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Custodian from "App/Models/Custodian";

export default class CustodiansController {
  public async index({ view }: HttpContextContract) {
    const data = await Custodian.all()

    return view.render('maintenance/custodian', {data})

  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
