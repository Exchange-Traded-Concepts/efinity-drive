import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import CalendarEvent from "App/Models/CalendarEvent";

export default class CalendarEventsController {
  public async index({}: HttpContextContract) {}

  public async create({request, session, response, auth}: HttpContextContract) {

    console.log('HERE 1')
    console.log(request.input('end_date'))
    let publicdisplay = true

    if(request.input('public') == 'on'){
       publicdisplay = true
    }
      else{
         publicdisplay = false
    }

    const data = await this.validateInput(request)

    console.log('HERE')
    console.log(data)

    await CalendarEvent.create({
      title: data.title,
      notes: request.input('notes'), //data.notes,
      public: publicdisplay ,//data.public,
      type: request.input('type'), //data.type,
      start_date: request.input('start_date'), //data.start_date,
      end_date: request.input('end_date'), //data.end_date,
      // @ts-ignore
      created_by: auth.user.id,
   })

    session.flash({notification: 'Date Added'})
    return response.redirect('back')

  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {

    const valSchema = schema.create({
      title: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(150)]),
      /*notes: schema.string.nullableAndOptional({ trim: true } ),
      public: schema.boolean.nullableAndOptional(),
      type: schema.string.nullableAndOptional({ trim: true } ),
      start_date: schema.string.nullableAndOptional({trim:true}),
      end_date: schema.string.nullableAndOptional({trim:true}),
      */
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'name.required': 'Name is required',
        'name.maxLength': 'Name allows upto 150 characters',
      },
    })
  }
}
