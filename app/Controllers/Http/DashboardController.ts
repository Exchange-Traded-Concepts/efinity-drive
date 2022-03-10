
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import CalendarConfig from "App/utils/calendarConfig";
import Task from "App/Models/Task";
import Fund from "App/Models/Fund";


export default class DashboardController {

  public async cal ({ view, request }: HttpContextContract){

    const year = request.input('year') || new Date().getFullYear();
    const months = ["January",  "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    const calendar = await CalendarConfig.calcTable(year)

    return view.render('admin', {calendar: calendar, months, year})

}

  public async index ({ view, auth}: HttpContextContract){


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
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy')})
      .preload('assignedTo')
      .preload('createdBy')
      // @ts-ignore
      .where('assigned_to', auth.user.id)
      .andWhere('completed', 0)
      .orderBy('target_completion_date')
      .limit(5)

    const funds = await Fund.query()
      .preload('client')
      .where('status', '!=', 'launched')
      .orderBy('target_launch_date')


    return view.render('admin/dashboard', {d, tasks, funds})
  }


}
