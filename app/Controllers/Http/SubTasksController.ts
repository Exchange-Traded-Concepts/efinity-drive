import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubTask from "App/Models/SubTask";
import FileUpload from "App/utils/fileUploader";
import users from "App/Models/users";
import Task from "App/Models/Task";


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
      document_name: request.input('document_name'),
      document_url: docurl,
      notes: request.input('notes')
    })

    return response.redirect('back')

  }

  public async show({params, view}: HttpContextContract) {

    const subTasks = await SubTask.query()
      .preload('createdBy')
      .preload('assignedTo')
      .where('task_id', params.task_id)
    const task = await Task.findBy('id', params.task_id)
    return view.render('admin/task_sub_tasks', {subTasks, task})
  }

  public async edit({ view, params }: HttpContextContract) {

    const subTask =    await SubTask.findBy('id',params.id)
    return view.render('client/index', { subTask })

  }

  public async add_subtask_to_task({params, view}: HttpContextContract){

    const etcUsers = await users.all()
    return view.render('maintenance/subtask', { params, etcUsers })


  }

  public async update({params, view, request, auth}: HttpContextContract) {

    const st = await SubTask.findOrFail( params.id)

    let docurl = ''
    if (request.input('document_url')){
      const data = await FileUpload.uploadToS3(request.file('upload'), 'uploads',  st.document_url)
      console.log(data.url)
      docurl = data.url

      st.merge({
        document_url : docurl
      })
      await st.save()
    }

    st.merge({
      title: request.input('title'),
      description: request.input('description'),
      assigned_to: request.input('assigned_to'),
      // @ts-ignore
      created_by: auth.user.id,
      task_id: request.input('task_id'),
      target_completion_date: request.input('target_completion_date'),
      completion_date: request.input('completion_date'),
      document_name: request.input('document_name'),
      notes: request.input('notes')
    })

    await st.save()

    return view.render('maint/subtask')
  }

  public async destroy({}: HttpContextContract) {}
}
