import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import CalendarConfig from "App/utils/calendarConfig";
import Task from "App/Models/Task";
import Fund from "App/Models/Fund";
import TaskStatus from "App/Models/TaskStatus";
import SubTask from "App/Models/SubTask";
import CalendarEvent from "App/Models/CalendarEvent";
import HelpDesk from "App/Models/HelpDesk";
import Env from "@ioc:Adonis/Core/Env";
import * as console from "console";



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

    let months_add_arr = [
      [13,1],
      [14,2],
      [15,3],
      [16,4],
      [17,5],
      [18,6],
      [19,7]
     ];

    let semi_month = eval(String(indexedMonth - (-7)));
    if(semi_month >= 13){
      semi_month = months_add_arr[semi_month]
    }
    console.log('semi')
    console.log(semi_month)
    let daysInMonth = new Date(year, (indexedMonth - (-1)), 0).getDate()
    const minRange = year+'-'+(indexedMonth - (-1))+'-'+'01';
    const maxRange = year+'-'+(indexedMonth - (-1)) +'-'+daysInMonth
    const launches = await Fund.query().whereBetween('target_launch_date',  [minRange, maxRange] )
    const seeds = await Fund.query().whereBetween('seed_date', [minRange, maxRange])
    const fye = await Fund.query().where('fiscal_year_end', '=', (indexedMonth - (-1)))
    const semi_annual = await Fund.query().where('fiscal_year_end', '=', semi_month)
    const events = await CalendarEvent.query()
      .preload('createdBy')
      .whereBetween('start_date', [minRange, maxRange])
      .orWhereBetween('end_date',[minRange, maxRange])
      .orderBy('type')
    let curMonth = months[indexedMonth]

    //console.log(events)

    return view.render('admin', {calendar: calendar[indexedMonth], months, year,  launches, indexedMonth: indexedMonth,
      curMonth, ctoday, seeds, events, fye, daysInMonth, semi_annual})

}

  public async index ({ view, session, auth}: HttpContextContract){


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

    const task_count = tasks.length

    const funds = await Fund.query()
      .preload('client')
      .whereNotIn('status',  ['launched', 'unlikely', 'other'])
      .orderBy('target_launch_date')
    console.log('userGroups V')
    console.log(session.get('user_groups'))
    const user_groups = session.get('user_groups')
    const status = await TaskStatus.query().orderBy('rank')

    const subtasks = await SubTask.query().whereIn('assigned_to_group_id', user_groups).andWhereNotIn('task_statuses_id', [3,4])

      /*.preload('task', (fundQuery) => {fundQuery.preload('fund')})
      .preload('taskStatus')
      .preload('assignedTo')
      .preload('createdBy')
      */
    const subtasks_count = subtasks.length

    const prelaunch_count = await Fund.query().where('status', 'prelaunch')
    const count = prelaunch_count.length

    // @ts-ignore
    const tickets = await HelpDesk.query().where('created_by', auth.user.id).andWhere('status', '!=', 'closed')

    const legend_birth = new Date("10/14/1973")
    const today = new Date()

    console.log('MONTH')
    const month = parseInt(String(today.getMonth() + 1))
    console.log(month)
    console.log('END Month')
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
    console.log('lastDay--> '+lastDayOfMonth)
    const year =  new Date().getFullYear();
    const daysInMonth =  new Date(year, month, 0).getDate();

    console.log('daysInMonth--> '+daysInMonth)

    const fye = await Fund.query().where('fiscal_year_end', '=' , month)

    var diff = today.getTime() - legend_birth.getTime()

    var Legend = diff / (1000 * 3600 * 24)

    var Legend_Days = Legend.toFixed(0)

    let cal_events = await CalendarEvent.query().where('type' ,'<>' , 'time_off')
      .andWhereRaw('( start_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) OR end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) )' )
      .orderBy('start_date')

    let launch_dates = await Fund.query().whereRaw('target_launch_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)')

    let seed_dates = await Fund.query().whereRaw('seed_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)')

    //let scroll = 'BITQ;AMOM;QRFT;UTRN;EMQQ;PAYC'

    let tickers = await Fund.query().where('status', '=', 'launched' ).select('ticker')

    const  trr = []
    for (let i = 0; i < tickers.length; i++) {
     // @ts-ignore
      trr.push(tickers[i].ticker)
    }

    let mpp = trr.join(';')

    let stockdonoKey = Env.get('STOCKDIO')

    return view.render('admin/dashboard', {d, tasks, funds, status, user_groups, subtasks, tickets,
    count, subtasks_count, task_count, Legend_Days, cal_events, launch_dates, seed_dates, tickers: mpp, stockdonoKey, fye})
  }
}
