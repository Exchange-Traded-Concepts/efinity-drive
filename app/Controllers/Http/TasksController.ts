import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from "App/Models/Task";
import users from "App/Models/users";
import Fund from "App/Models/Fund";
import Database from "@ioc:Adonis/Lucid/Database";


export default class TasksController {
  public async index({view, auth}: HttpContextContract) {
    const etcUsers = await users.query().where('is_admin', 1)

    const tasks = await Task.query()
      .preload('fund')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy')})
      .preload('assignedTo')
      .preload('createdBy')
      // @ts-ignore
      .where('assigned_to', auth.user.id).orderBy('target_completion_date')
    const funds  = await Fund.all()

   const p = await Database.rawQuery("SELECT t.id ,st.title as s_title, st.description as st_desc,  t.title as t_title, " +
      " u.first_name as first_name, u.last_name as last_name, DATE_FORMAT(st.target_completion_date, '%c/%e/%Y') as st_tcd, st.target_completion_date " +
      " FROM sub_tasks as st " +
      " JOIN tasks as t ON st.task_id = t.id " +
      " JOIN users as u ON st.created_by = u.id " +
      // @ts-ignore
      " WHERE st.assigned_to = ? order by st.target_completion_date ", [auth.user.id] )

   let sub = p[0]

    //const sub = await SubTask.query().preload('task').preload('createdBy').preload('assignedTo').preload('fund')

       return view.render('maintenance/task', {etcUsers, tasks, funds, sub})
  }

  public async create({request,auth, response, session }: HttpContextContract) {
    await Task.create({
      title: request.input('title'),
      description:request.input('description'),
      assigned_to: request.input('assigned_to'),
      fundId: request.input('fund_id'),
      // @ts-ignore
      created_by: auth.user.id,
      target_completion_date: request.input('target_completion_date')
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

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async add({view}: HttpContextContract) {

    const etcUsers = await users.query().where('is_admin', 1)
    const funds  = await Fund.all()
    return view.render('maintenance/add_task', {etcUsers, funds})
  }


  public async destroy({}: HttpContextContract) {}
}
