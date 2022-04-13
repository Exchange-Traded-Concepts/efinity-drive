import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from "App/Models/Task";
import users from "App/Models/users";
import Fund from "App/Models/Fund";
import Database from "@ioc:Adonis/Lucid/Database";
import Mail from "@ioc:Adonis/Addons/Mail";
import TaskStatus from "App/Models/TaskStatus";


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
      .where('assigned_to', auth.user.id).orderBy('target_completion_date')
    const funds  = await Fund.all()
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

  public async create({request,auth, response, session }: HttpContextContract) {
    await Task.create({
      title: request.input('title'),
      description:request.input('description'),
      assigned_to: request.input('assigned_to'),
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

  public async show({auth, view}: HttpContextContract) {
    // @ts-ignore
    const tasks = await Task.query().preload('createdBy').preload('subtasks').where('assigned_to', auth.user.id)
    console.log(tasks)
    return view.render('admin/tasks', {tasks})
  }

  public async edit({view, params}: HttpContextContract) {

    const etcUsers = await users.query().where('is_admin', 1)
    const funds  = await Fund.all()
    const u_task = await Task.findBy('id', params.id)
    console.log(u_task)
    const taskstatuses = await TaskStatus.query().orderBy('rank')
    return view.render('maintenance/add_task', {etcUsers, funds, taskstatuses, u_task})


  }

  public async update({request, session, response, params}: HttpContextContract) {

    const task = await Task.findOrFail( params.id)
    //const data = await this.validateInput(request)

    task.merge({
      title: request.input('title'),
      description:request.input('description'),
      assigned_to: request.input('assigned_to'),
      fundId: request.input('fund_id'),
      target_completion_date: request.input('target_completion_date'),
      task_statuses_id: request.input('task_statuses_id')
    })

    await task.save()
    session.flash('notification', 'Task Updated.')
    return response.redirect().back()


  }

  public async add({view}: HttpContextContract) {

    const etcUsers = await users.query().where('is_admin', 1)
    const funds  = await Fund.all()
    const taskstatuses = await TaskStatus.query().orderBy('rank')
    return view.render('maintenance/add_task', {etcUsers, funds, taskstatuses})
  }

  public async email({}){
      await Mail.send((message) => {
        message
          .from('info@etcdev.com')
          .to('soonerdm@gmail.com')
          .subject('Welcome Onboard!')
          .htmlView('emails/welcome', { name: 'David', url :"http://www.google.com" })
      })

  }

  public async to_do({view, auth}: HttpContextContract){

    const tasks = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      // @ts-ignore
      .where('assigned_to', auth.user.id)
      .andWhere('task_statuses_id', '<=', '2')
      .orderBy('target_completion_date', )

    const funds  = await Fund.all()
    const status = await TaskStatus.query().orderBy('rank')
    const etcUsers = await users.query().where('is_admin', 1)

    return view.render('maintenance/task', {etcUsers, tasks, funds, status})
  }



  public async task_by_status({params, view, auth}: HttpContextContract){

    const tasks = await Task.query()
      .preload('fund')
      .preload('taskStatus')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      // @ts-ignore
      .where('assigned_to', auth.user.id)
      .andWhere('task_statuses_id', params.status_id)
      .orderBy('target_completion_date', 'desc')

    const funds  = await Fund.all()
    const status = await TaskStatus.query().orderBy('rank')
    const etcUsers = await users.query().where('is_admin', 1)

    return view.render('maintenance/task', {etcUsers, tasks, funds, status})
  }


  public async taskStatus({params, response} : HttpContextContract){

    const task = await Task.findOrFail(params.task_id)
    task.merge(
      {
        task_statuses_id : params.status_id
      }
    )
    await task.save()
    //session.flash('notification', 'Task Updated.')
    return response.redirect().back()
  }


  public async destroy({}: HttpContextContract) {}
}
