import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubTask from "App/Models/SubTask";
import FileUpload from "App/utils/fileUploader";
import users from "App/Models/users";
import Task from "App/Models/Task";
import TaskStatus from "App/Models/TaskStatus";
import Document from "App/Models/Document";
import Group from "App/Models/Group";
import EFMailer from "App/utils/mailer";
import Env from "@ioc:Adonis/Core/Env";



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
      assigned_to_group_id: request.input('assigned_to'),
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

  public async edit({ view, params, session }: HttpContextContract) {

    const subTask =    await SubTask.findBy('id',params.id)
    const etcUsers = await users.all()
    const groups = await Group.all()
    const user_groups = session.get('user_groups')
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


    return view.render('maintenance/subtask', { params, etcUsers, subTask, tasks, status, docs , groups, user_groups})
  }

  public async add_subtask_to_task({params, view, session}: HttpContextContract){

    const etcUsers = await users.all()
    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      .where('id', params.task_id).orderBy('target_completion_date')

    const status = await TaskStatus.query().orderBy('rank')
    const groups = await Group.all()
    const user_groups = session.get('user_groups')
    const docs = await Document.query().where('doc_type_id', 3).andWhere('resource_id', params.task_id)
    return view.render('maintenance/subtask', { params, etcUsers, tasks, status, docs, groups, user_groups })


  }

  public async update({params, response, request, auth, session}: HttpContextContract) {

    const st = await SubTask.findOrFail( params.id)

   let changes = []

    if(st.title != request.input('title')){
      // @ts-ignore
      changes.push("Title")
    }
    if(st.description != request.input('description')){
      // @ts-ignore
      changes.push('Description')
    }
    if(st.assigned_to_group_id != request.input('assigned_to')){
      // @ts-ignore
      changes.push('Group Assignment')
    }
    if(st.target_completion_date && st.target_completion_date.toFormat('y-MM-d') != request.input('target_completion_date')){
      // @ts-ignore
      changes.push('Target Completion Date')
    }
    if(st.task_statuses_id != request.input('task_statuses_id')){
      // @ts-ignore
      changes.push('Status Updated')
    }

    console.log(st.target_completion_date.toFormat('y-MM-d'))
    console.log(request.input('target_completion_date'))

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
      assigned_to_group_id: request.input('assigned_to'),
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

    const x = changes.toString()

    let IDarray = []
    if(st.assigned_to_group_id != request.input('assigned_to')){
      // @ts-ignore
      IDarray = [st.assigned_to_group_id,  request.input('assigned_to')]
    }
    else{
      // @ts-ignore
      IDarray = [st.assigned_to_group_id]
    }

    const task = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      .preload('fund')
      // @ts-ignore
      .where('id', st.taskId).orderBy('target_completion_date')

    const st_title = st.title
    const task_title = task[0].title
    const fund_name = task[0].fund.fund_name

    console.log(IDarray)

    const mailTo = await EFMailer.getEmailByGroupArray(IDarray)
    if(mailTo) {
      await EFMailer.email(mailTo, 'Subtask Update', 'emails/sub_task_update',
        {
          changes: x,
          sub_task_title: st_title,
          task_title: task_title,
          fund_name: fund_name
        })
    }
    session.flash('notification', 'Sub Task Updated')
    return response.redirect().back()

  }

  public async taskStatus({params, response}: HttpContextContract){
    const subtask = await SubTask.findOrFail(params.sub_task_id)

    subtask.merge({
      task_statuses_id : params.status_id
    })

    await subtask.save()
    try {
      const subTask = await SubTask.query().preload('task', (fundQuery) => {fundQuery.preload('fund')}).where('id', subtask.id)
      const fund_name = subTask[0].task.fund.fund_name
      const status = await TaskStatus.query().where('id', params.status_id)
      const mailTo = await EFMailer.getEmailByGroupArray([subtask.assigned_to_group_id])
      const url = Env.get('URL')
      await EFMailer.email(mailTo, 'Sub Task Status Updated', 'emails/subtask_status_update', {
        status: status[0].name,
        fund_name: fund_name,
        task_title: subTask[0].task.title,
        task_id: subTask[0].task.id,
        sub_task_title: subTask[0].title,
        url: url
      })
    }
    catch (err){
      console.log(err)
    }

    return response.redirect().back()
  }



  public async destroy({}: HttpContextContract) {}
}
