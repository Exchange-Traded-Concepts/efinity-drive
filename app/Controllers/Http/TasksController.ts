import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from "App/Models/Task";
import users from "App/Models/users";
import Fund from "App/Models/Fund";

export default class TasksController {
  public async index({view, auth}: HttpContextContract) {
    const etcUsers = await users.query().where('is_admin', 1)
    // @ts-ignore
    const tasks = await Task.query().preload('createdBy').where('assigned_to', auth.user.id)
    const funds  = await Fund.all()
    return view.render('maintenance/task', {etcUsers, tasks, funds})
  }

  public async create({request,auth, response }: HttpContextContract) {
    await Task.create({
      title: request.input('title'),
      description:request.input('description'),
      assigned_to: request.input('assigned_to'),
      fundId: request.input('fund_id'),
      // @ts-ignore
      created_by: auth.user.id,
      target_completion_date: request.input('target_completion_date')
    })

    return response.redirect('back')
  }

  public async store({}: HttpContextContract) {}

  public async show({auth, view}: HttpContextContract) {
    // @ts-ignore
    const tasks = await Task.query().preload('createdBy').where('assigned_to', auth.user.id)
    console.log(tasks)
    return view.render('admin/tasks', {tasks})
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
