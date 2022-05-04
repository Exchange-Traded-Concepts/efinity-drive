import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubTask from "App/Models/SubTask";
import FileUpload from "App/utils/fileUploader";
import users from "App/Models/users";
import Task from "App/Models/Task";
import TaskStatus from "App/Models/TaskStatus";
import Document from "App/Models/Document";


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
      notes: request.input('notes'),
      task_statuses_id: request.input('task_statuses_id')
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
    const etcUsers = await users.all()
    const status = await TaskStatus.query().orderBy('rank')

    params.task_id = subTask?.taskId


    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      // @ts-ignore
      .where('id', subTask.taskId).orderBy('target_completion_date')
    // @ts-ignore
    const docs = await Document.query().where('doc_type_id', 3).andWhere('resource_id', subTask.taskId)


    return view.render('maintenance/subtask', { params, etcUsers, subTask, tasks, status, docs })
  }

  public async add_subtask_to_task({params, view}: HttpContextContract){

    const etcUsers = await users.all()
    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      .where('id', params.task_id).orderBy('target_completion_date')

    const status = await TaskStatus.query().orderBy('rank')
    const docs = await Document.query().where('doc_type_id', 3).andWhere('resource_id', params.task_id)
    return view.render('maintenance/subtask', { params, etcUsers, tasks, status, docs })


  }

  public async update({params, response, request, auth, session}: HttpContextContract) {

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
      notes: request.input('notes'),
      task_statuses_id: request.input('task_statuses_id')
    })

    await st.save()
/*
    const etcUsers = await users.all()

    let task_id = request.input('task_id')
    params.task_id = request.input('task_id')

    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      .where('id', task_id).orderBy('target_completion_date')

    const status = await TaskStatus.query().orderBy('rank')
    const docs = await Document.query().where('doc_type_id', 3).andWhere('resource_id', task_id)

 */
    session.flash('notification', 'Sub Task Updated')
    return response.redirect().back()
   // return view.render('maintenance/subtask', { params, etcUsers, tasks, status, docs })
  }

  public async taskStatus({params, response}: HttpContextContract){
    const subtask = await SubTask.findOrFail(params.sub_task_id)

    subtask.merge({
      task_statuses_id : params.status_id
    })

    await subtask.save()
    //session.flash('notification', 'Task Updated.')
    return response.redirect().back()
  }



  public async destroy({}: HttpContextContract) {}
}
