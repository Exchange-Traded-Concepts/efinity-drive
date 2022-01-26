import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientContact from "App/Models/ClientContact";
import {rules, schema} from "@ioc:Adonis/Core/Validator";

export default class ClientContactsController {
  public async index({params, view}: HttpContextContract) {

    return view.render('maintenance/clientcontact', {client_id : params.client_id})

  }

  public async create({}: HttpContextContract) {}

  public async store({request, session, response}: HttpContextContract) {
    //const data = await this.validateInput(request)
    await ClientContact.create({
      name: request.input('name'),
      clientId: request.input('client_id'),
      role: request.input('role'),
      email: request.input('email'),
      phone:request.input('phone'),
      secondary_email: request.input('secondary_email'),
      notes : request.input('notes')

    })
    session.flash('notification', 'Contact saved.')
    return response.redirect().back()

  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      role: schema.string({trim: true}, [rules.maxLength(255)]),
     /* email: schema.string({trim: true}, [rules.maxLength(255), rules.email() || '' ]),
      phone: schema.string({trim: true}, [rules.maxLength(2)]),
      notes: schema.string({trim: true}, [rules.maxLength(10)]),

      */
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'name.required': 'Name is required',
        'name.maxLength': 'Name allows upto 150 characters',
        'role.maxlength': '255',
      },
    })
  }

}
