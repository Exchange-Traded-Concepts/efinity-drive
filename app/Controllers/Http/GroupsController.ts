import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from "App/Models/Group";

export default class GroupsController {
  public async index({view}: HttpContextContract) {

    const groups = await Group.query().orderBy('rank')

    return view.render('maintenance/group', {groups})
  }

  public async create({request, session, response}: HttpContextContract) {
    await Group.create({
      name: request.input('name'),
      rank: request.input('rank'),
    })

    session.flash('notification', 'Group Added')
    return response.redirect('back')
  }


  public async store({}: HttpContextContract) {
  }

  public async show({}: HttpContextContract) {
  }

  public async edit({params, view}: HttpContextContract) {
    const groups = await Group.query().orderBy('rank')
    const group = await Group.findOrFail(params.id)
    return view.render('maintenance/group', {groups, group})
  }

  public async update({params, request, response, session}: HttpContextContract) {

    const g = await Group.findOrFail(params.id)
    g.merge({
      name: request.input('name'),
      rank: request.input('rank'),
    })
    await g.save()
    session.flash('notification', 'Group Updated')
    return response.redirect('back',)
  }

  public async destroy({}: HttpContextContract) {
  }

}
