import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from "App/Models/Task";
import users from "App/Models/users";
import Fund from "App/Models/Fund";
import Database from "@ioc:Adonis/Lucid/Database";
import TaskStatus from "App/Models/TaskStatus";
import Group from "App/Models/Group";
import EFMailer from "App/utils/mailer";
import Env from "@ioc:Adonis/Core/Env";
import Note from "App/Models/Note";
import * as console from "console";
import Document from "App/Models/Document";


export default class TasksController {
  public async index({view, auth}: HttpContextContract) {
    const etcUsers = await users.query().where('is_admin', 1)

    const tasks = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      // @ts-ignore
      .whereIn('assigned_to_group_id', session.get('user_groups')).orderBy('target_completion_date')
    const funds  = await Fund.query().orderBy('ticker')
    const status = await TaskStatus.query().orderBy('rank')

   const p = await Database.rawQuery("SELECT t.id ,st.title as s_title, st.description as st_desc,  t.title as t_title, " +
      " u.first_name as first_name, u.last_name as last_name, DATE_FORMAT(st.target_completion_date, '%c/%e/%Y') as st_tcd, st.target_completion_date " +
      " FROM sub_tasks as st " +
      " JOIN tasks as t ON st.task_id = t.id " +
      " JOIN users as u ON st.created_by = u.id " +
      // @ts-ignore
      " WHERE st.assigned_to = ? order by st.target_completion_date ", [auth.user.id] )

   let sub = p[0]

    //const sub = await SubTask.query().preload('task').preload('createdBy').preload('assignedTo').preload('fund')

       return view.render('maintenance/task', {etcUsers, tasks, funds, sub, status})
  }

  public async viewTask({params, view}: HttpContextContract){
    const task = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .where('id', '=', params.id)

      const trunc_notes = await Note.query()
        .preload('createdBy')
        .where('resource_id', '=', params.id)
        .andWhere('note_type_id', '=', 3).limit(3)
        .orderBy('created_at', 'desc')

    const notes = await Note.query()
      .preload('createdBy')
      .where('resource_id', '=', params.id)
      .andWhere('note_type_id', '=', 3)


    let sub_notes = await Database.rawQuery("SELECT st.title, st.description, st.created_by, st.target_completion_date," +
       "   n.id, n.note_type_id, n.resource_id, n.text, n.created_at " +
       " FROM notes n, users u, sub_tasks st WHERE n.created_by = u.id AND n.resource_id = st.id AND note_type_id = 4 " +
       " AND st.task_id = ?" , [params.id])

      sub_notes = sub_notes[0];

    /*const docs = await Database.rawQuery("SELECT d.id, d.doc_type_id, d.name, d.url, d.size, d.type, d.created_at, t.title " +
      " FROM documents as d, tasks as t " +
      "WHERE d.resource_id = t.id AND t.id = ? AND d.doc_type_id = 3 ORDER BY d.created_at ", [params.id])
      .debug(true)
    */

    const docs = await Document.query().where('doc_type_id', '=',3 ).andWhere('resource_id', '=', params.id)

    let sub_docs = await Database.rawQuery("SELECT d.id, d.doc_type_id, d.name, d.url, d.size, d.type, DATE_FORMAT(d.created_at, '%m/%d/%Y') as createdAt, st.title " +
      " FROM documents as d, sub_tasks as st " +
      "WHERE d.resource_id = st.id AND st.task_id = ? AND d.doc_type_id = 4 ORDER BY d.created_at ", [params.id])

    sub_docs = sub_docs[0]

    const status = await TaskStatus.query().orderBy('rank')

    return view.render('admin/view_task', {status, task, t: task[0], resource_id: params.id, note_type_id:3, trunc_notes, docs, sub_docs, sub_notes, notes })
  }

  public async create({request,auth, response, session }: HttpContextContract) {
    await Task.create({
      title: request.input('title'),
      description:request.input('description'),
      assigned_to_group_id: request.input('assigned_to_group_id'),
      fundId: request.input('fund_id'),
      // @ts-ignore
      created_by: auth.user.id,
      target_completion_date: request.input('target_completion_date'),
      task_statuses_id: request.input('task_statuses_id')
    })

    session.flash('notification', 'Task Added')
    return response.redirect('back')
  }

  public async store({}: HttpContextContract) {}

  public async show({view}: HttpContextContract) {
    // @ts-ignore
    const tasks = await Task.query().preload('createdBy').preload('subtasks').whereIn('assigned_to_group_id', session.get('user_groups'))
    console.log(tasks)
    return view.render('admin/tasks', {tasks})
  }

  public async edit({view, params}: HttpContextContract) {

    const etcUsers = await users.query().where('is_admin', 1)
    const funds  = await Fund.query().orderBy('ticker')
    const u_task = await Task.findBy('id', params.id)
    const groups = await Group.all()
    const taskstatuses = await TaskStatus.query().orderBy('rank')
    return view.render('maintenance/add_task', {groups, etcUsers, funds, taskstatuses, u_task})


  }

  /* Update the entire task from the maint page */
  public async update({request, session, response, params}: HttpContextContract) {

    const task = await Task.findOrFail( params.id)
    //const data = await this.validateInput(request)

    let changes = []
    if(task.title != request.input('title')){
      // @ts-ignore
      changes.push("Title")
    }
    if(task.description != request.input('description')){
      // @ts-ignore
      changes.push('Description')
    }
    if(task.assigned_to_group_id != request.input('assigned_to_group_id')){
      // @ts-ignore
      changes.push('Group Assignment')
    }
    if(task.target_completion_date) {
      if (task.target_completion_date.toFormat('y-MM-dd') != request.input('target_completion_date')) {
        // @ts-ignore
        changes.push('Target Completion Date')
      }
    }
    if(task.task_statuses_id != request.input('task_statuses_id')){
      // @ts-ignore
      changes.push('Status Updated')
    }

    task.merge({
      title: request.input('title').trim(),
      description:request.input('description').trim(),
      assigned_to_group_id: request.input('assigned_to_group_id'),
      fundId: request.input('fund_id'),
      target_completion_date: request.input('target_completion_date'),
      task_statuses_id: request.input('task_statuses_id')
    })

    await task.save()

    const x = changes.toString()

    let IDarray = []
    if(task.assigned_to_group_id != request.input('assigned_to_group_id')){
         // @ts-ignore
      IDarray = [task.assigned_to_group_id,  request.input('assigned_to_group_id')]
    }
    else{
         // @ts-ignore
      IDarray = [task.assigned_to_group_id]
    }

    const fund = await Fund.query().where('id', request.input('fund_id'))
    const url = Env.get('URL')

    const mailTo = await EFMailer.getEmailByGroupArray(IDarray)
    await EFMailer.email(mailTo, 'Task Update', 'emails/task_update',
      {changes: x,
        fund_name : fund[0].fund_name,
        task_title: request.input('title'),
        url: url,
        task_id: task.id
      })


    session.flash('notification', 'Task Updated.')
    return response.redirect().back()


  }

  public async add({view, params}: HttpContextContract) {

    const etcUsers = await users.query().where('is_admin', 1)
    const groups = await Group.all()
    const fund = await Fund.findBy('id', params.id)
    console.log(fund)
    let u_task = fund
    // @ts-ignore
    u_task.fundId = u_task.id
    const funds  = await Fund.query().orderBy('ticker')
    const taskstatuses = await TaskStatus.query().orderBy('rank')
    // @ts-ignore
    return view.render('maintenance/add_task', {groups, etcUsers, funds, taskstatuses, fund_id : fund.id, u_task})
  }

  public async email({}){

    /*  await Mail.send((message) => {
        message
          .from('info@etcdev.com')
          .to('soonerdm@gmail.com')
          .subject('Welcome Onboard!')
          .htmlView('emails/welcome', { name: 'David', url :"http://www.google.com" })
      })

     */

    await EFMailer.getEmailByGroupArray([1,6])


  }

  public async to_do({view, session}: HttpContextContract){

    console.log(session.get('user_groups'))
    const tasks = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .whereIn('assigned_to_group_id', session.get('user_groups'))
      .andWhere('task_statuses_id', '<=', '2')
      .orderBy('target_completion_date', )

    const funds  = await Fund.query().orderBy('ticker')
    const status = await TaskStatus.query().orderBy('rank')
    const etcUsers = await users.query().where('is_admin', 1)
    const user_groups = session.get('user_groups')

    return view.render('maintenance/task', {etcUsers, tasks, funds, status, user_groups})
  }



  public async task_by_status({params, view, session}: HttpContextContract){

    console.log(session.get('user_groups'))
    const tasks = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .whereIn('assigned_to_group_id', session.get('user_groups'))
      .andWhere('task_statuses_id', params.status_id)
      .orderBy('target_completion_date', 'desc')

    const funds  = await Fund.query().orderBy('ticker')

    const status = await TaskStatus.query().orderBy('rank')
    const etcUsers = await users.query().where('is_admin', 1)
    const user_groups = session.get('user_groups')

    return view.render('maintenance/task', { user_groups, etcUsers, tasks, funds, status})
  }


  public async taskStatus({params, response} : HttpContextContract){

    const task = await Task.findOrFail(params.task_id)
    task.merge(
      {
        task_statuses_id : params.status_id
      }
    )
    await task.save()
    try {
      const nTask = await Task.query().preload('fund').where('id', task.id)
      const fund_name = nTask[0].fund.fund_name
      const status = await TaskStatus.query().where('id', params.status_id)
      const mailTo = await EFMailer.getEmailByGroupArray([task.assigned_to_group_id])
      const url = Env.get('URL')
      await EFMailer.email(mailTo, 'Task Status Updated', 'emails/task_status_update', {
        status: status[0].name,
        fund_name: fund_name,
        task_title: task.title,
        task_id: task.id,
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
