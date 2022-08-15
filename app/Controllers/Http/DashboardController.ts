
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import CalendarConfig from "App/utils/calendarConfig";
import Task from "App/Models/Task";
import Fund from "App/Models/Fund";
import TaskStatus from "App/Models/TaskStatus";
import SubTask from "App/Models/SubTask";
import CalendarEvent from "App/Models/CalendarEvent";



export default class DashboardController {

  public async cal ({ view, params }: HttpContextContract){

    let today = new Date();
    let dd = String(today.getDate());//.padStart(2, '0');
    let mm = String(today.getMonth() + 1);//.padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    const ctoday = yyyy + '-' + mm + '-' + dd;

    let year = params.year || new Date().getFullYear();
    const months = ["January",  "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    let indexedMonth = params.month || new Date().getMonth() ;

    if(indexedMonth == -1){
      indexedMonth = 11;
      year = (year -1)
    }
    if(indexedMonth == 12){
      indexedMonth = 0
      year = (year - (-1))
    }
   const calendar = await CalendarConfig.calcTable(year, indexedMonth)

    let daysInMonth = new Date(year, (indexedMonth - (-1)), 0).getDate()
    const minRange = year+'-'+(indexedMonth - (-1))+'-'+'01';
    const maxRange = year+'-'+(indexedMonth - (-1)) +'-'+daysInMonth
    const launches = await Fund.query().whereBetween('target_launch_date',  [minRange, maxRange] )
    const seeds = await Fund.query().whereBetween('seed_date', [minRange, maxRange])
    const events = await CalendarEvent.query()
      .preload('createdBy')
      .whereBetween('start_date', [minRange, maxRange])
      .orWhereBetween('end_date',[minRange, maxRange])
      .orderBy('type')
    let curMonth = months[indexedMonth]

    return view.render('admin', {calendar: calendar[indexedMonth], months, year,  launches, indexedMonth: indexedMonth, curMonth, ctoday, seeds, events})

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
