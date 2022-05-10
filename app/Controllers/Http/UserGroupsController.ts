import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from "App/Models/Group";
import users from "App/Models/users";

import Database from "@ioc:Adonis/Lucid/Database";

export default class UserGroupsController {
  public async index({params, view}: HttpContextContract) {

    const groups = await Group.query().orderBy('rank')
   /* const user = await users.find( params.id )
    if(user) await user.related('groups').query()
   */

    const user = await users.query().where('id', params.id)
    const user_groups = await Database.rawQuery('SELECT group_id FROM user_groups WHERE user_id = ?', [params.id])

    console.log(user_groups[0])
    return view.render('maintenance/user_group', {user, groups, user_groups})


  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({request, session, response} : HttpContextContract) {

    const user_id = request.input('user_id')
    const groups  = request.input('group_id')
    await Database.rawQuery('DELETE FROM user_groups where user_id = ?', [user_id])

    for (let i = 0; i < groups.length; i++) {
      await Database.rawQuery('INSERT INTO user_groups (`user_id`  , `group_id` ) values(?, ?)' , [user_id, groups[i]])
    }
    session.flash({notification: 'Groups Updated'})
    return response.redirect('back')

  }

  public async destroy({}: HttpContextContract) {}
}
