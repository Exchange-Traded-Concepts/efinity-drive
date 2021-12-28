
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import CalendarConfig from "App/utils/calendarConfig";

export default class DashboardController {

  public async index ({ view, request }: HttpContextContract){

    const year = request.input('year') || 2022;
    const months = ["January",  "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    const calendar = await CalendarConfig.calcTable(year)

    return view.render('admin', {calendar: calendar, months, year})

}

}
