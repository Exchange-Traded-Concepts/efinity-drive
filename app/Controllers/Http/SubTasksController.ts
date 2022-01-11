import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubTask from "App/Models/SubTask";
import FileUpload from "App/utils/fileUploader";

export default class SubTasksController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({auth, response, request}: HttpContextContract) {

    let docurl = ''
    if (request.input('document_url')){
      const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads', null)
      console.log(data.url)
      docurl = data.url
    }

    await SubTask.create({
      title: request.input('title'),
      description: request.input('description'),
      assigned_to: request.input('assigned_to'),
      // @ts-ignore
      created_by: auth.user.id,
      task_id: request.input('task_id'),
      target_completion_date: request.input('target_completion_date'),
      completion_date: request.input('completion_date'),
      document_url: docurl,
      notes: request.input('notes')
    })

    return response.redirect('back')

  }

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
