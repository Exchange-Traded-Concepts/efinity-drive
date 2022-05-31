
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import CalendarConfig from "App/utils/calendarConfig";
import Task from "App/Models/Task";
import Fund from "App/Models/Fund";
import TaskStatus from "App/Models/TaskStatus";
import SubTask from "App/Models/SubTask";



export default class DashboardController {

  public async cal ({ view, request }: HttpContextContract){

    const year = request.input('year') || new Date().getFullYear();
    const months = ["January",  "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    const calendar = await CalendarConfig.calcTable(year)

    return view.render('admin', {calendar: calendar, months, year})

}

  public async index ({ view, session}: HttpContextContract){


    const axios = require('axios');

    const navId = 26

    async function makeGetRequest(navId) {

      let res = await axios.get(`https://cms.etc-webmaker.com/navs/${navId}`);

      let data = res.data;
    //  console.log(data);
      return data
    }

    let d = await makeGetRequest(navId);

    const tasks = await Task.query()
      .preload('fund')
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      // @ts-ignore
      .whereIn('assigned_to_group_id', session.get('user_groups'))
      .andWhere('completed', 0)
      .andWhere('task_statuses_id' ,'<=', '2')
      .orderBy('target_completion_date')
      .limit(5)

    const funds = await Fund.query()
      .preload('client')
      .where('status', '!=', 'launched')
      .orderBy('target_launch_date')
    console.log('userGroups V')
    console.log(session.get('user_groups'))
    const user_groups = session.get('user_groups')
    const status = await TaskStatus.query().orderBy('rank')

    const subtasks = await SubTask.query().whereIn('assigned_to_group_id', user_groups).andWhereNotIn('task_statuses_id', [3,4])
      .preload('task', (fundQuery) => {fundQuery.preload('fund')})
      .preload('taskStatus')
      .preload('assignedTo')
      .preload('createdBy')

  return view.render('admin/dashboard', {d, tasks, funds, status, user_groups, subtasks})
  }
}
