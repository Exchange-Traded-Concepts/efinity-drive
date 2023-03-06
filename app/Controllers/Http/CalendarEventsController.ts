import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import CalendarEvent from "App/Models/CalendarEvent";
import Fund from "App/Models/Fund";
import * as console from "console";

export default class CalendarEventsController {
  public async index({view, auth}: HttpContextContract) {

    let today = new Date();
    let dd = String(today.getDate());//.padStart(2, '0');
    let mm = String(today.getMonth() + 1);//.padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    const ctoday = yyyy + '-' + mm + '-' + dd;
    // @ts-ignore
    const events = await CalendarEvent.query().where('created_by', auth.user.id).andWhere('end_date', '>=', ctoday)

    return view.render('maintenance/cal_event', {events});

  }

  public async create({request, session, response, auth}: HttpContextContract) {

    let publicdisplay = true

    if(request.input('public') == 'on'){
       publicdisplay = true
    }
      else{
         publicdisplay = false
    }

    const data = await this.validateInput(request)

    if(data.end_date == '' || !data.end_date) {
      data.end_date = data.start_date;
    }

    let yr = data.start_date.substring(0,4)
    let mnth = data.start_date.substring(5,7) -1

    await CalendarEvent.create({
      title: data.title,
      notes: data.notes,
      public: publicdisplay ,//data.public,
      type: data.type,
      start_date: data.start_date,
      end_date: data.end_date,
      // @ts-ignore
      created_by: auth.user.id,
   })

    session.flash({notification: 'Date Added'})
    return response.redirect(`/cal/${mnth}/${yr}`);

  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({view, auth, params}: HttpContextContract) {

    let today = new Date();
    let dd = String(today.getDate());//.padStart(2, '0');
    let mm = String(today.getMonth() + 1);//.padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    const ctoday = yyyy + '-' + mm + '-' + dd;
    // @ts-ignore
    const events = await CalendarEvent.query().where('created_by', auth.user.id).andWhere('end_date', '>=', ctoday)
    //@ts-ignore
    let c_event = await CalendarEvent.findBy('id', params.id)

    // @ts-ignore
    if(c_event.created_by != auth.user.id){
      return view.render('/cal')
    }
   // console.log(c_event)
    return view.render('maintenance/cal_event', {c_event, events});
  }

  public async update({request, session, auth, params, view, response}: HttpContextContract) {
    let publicdisplay = true

    if(request.input('public') == 'on'){
      publicdisplay = true
    }
    else{
      publicdisplay = false
    }

    const event = await CalendarEvent.findOrFail( params.id)

    // @ts-ignore
    if(event.created_by != auth.user.id){
      session.flash({notification: 'Not Authorized'})
      return view.render('maintenance/cal_event');
      }

    const data = await this.validateInput(request)

    if(data.end_date == '' || !data.end_date) {
      data.end_date = data.start_date;
    }

    event.merge({
      title: data.title,
      notes: data.notes,
      public: publicdisplay ,//data.public,
      type: data.type,
      start_date: data.start_date,
      end_date: data.end_date,
    })

    await event.save()
    session.flash('notification', 'Event Updated')
    return response.redirect('back')
  }

  public async dayList({params}:HttpContextContract){
    const day = params.date
    console.log(day)

    const events = await CalendarEvent.query()
      .preload('createdBy')
      .where("start_date", "<=" , params.date)
      .andWhere("end_date", ">=", params.date )
      .andWhere('public', "=", 1);
    return events

  }

  public async tickerByMonth({params}:HttpContextContract){
    const funds = await Fund.query().where('fiscal_year_end', '=', params.month)
    return funds
  }

  public async destroy({params, auth, session,response}: HttpContextContract) {
   try {
     // @ts-ignore
     await CalendarEvent.query().where('id', params.id).andWhere('created_by', auth.user.id).delete()
   }
   catch (e) {
     return response.abort('Access Denied ')
   }
   session.flash({notification: 'Event Removed'})
   return response.redirect().toRoute('CalendarEventsController.index');
   }

  private async validateInput(request) {

    const valSchema = schema.create({
      title: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(150)]),
      notes: schema.string.nullableAndOptional({ trim: true } ),
      type: schema.string.nullableAndOptional({ trim: true } ),
      start_date: schema.string.nullableAndOptional({trim:true}, [rules.required()]),
      end_date: schema.string.nullableAndOptional({trim:true}),
     })

    return await request.validate({
      schema: valSchema,
      messages: {
       'title.maxLength': 'Name allows upto 150 characters',
      },
    })
  }
}
