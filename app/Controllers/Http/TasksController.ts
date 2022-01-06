import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from "App/Models/Task";
import users from "App/Models/users";

export default class TasksController {
  public async index({view, auth}: HttpContextContract) {
    const etcUsers = await users.query().where('is_admin', 1)
    // @ts-ignore
    const tasks = await Task.query().where('assigned_to', auth.user.id)
    return view.render('maintenance/task', {etcUsers, tasks})
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({auth, view}: HttpContextContract) {
    // @ts-ignore
    const tasks = await Task.query().where('assigned_to', auth.user.id)
    console.log(tasks)
    return view.render('admin/tasks', {tasks})
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
