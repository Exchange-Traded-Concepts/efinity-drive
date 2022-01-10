import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubTask from "App/Models/SubTask";

export default class SubTasksController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({params, view}: HttpContextContract) {

    const subTasks = await SubTask.query()
      .preload('taskId')
      .preload('createdBy')
      .preload('assignedTo')
      .where('task_id', params.task_id)
    return view.render('admim/task_sub_tasks', {subTasks})
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
