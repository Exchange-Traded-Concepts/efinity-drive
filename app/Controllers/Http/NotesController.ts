import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Note from "App/Models/Note";


export default class NotesController {
  public async index({}: HttpContextContract) {}

  public async create({session, request, response, auth}: HttpContextContract) {

    await Note.create({
      text: request.input('text'),
      note_type_id: request.input('note_type_id'),
      resource_id: request.input('resource_id'),
      // @ts-ignore
      created_by: auth.user.id,
     })
    session.flash({notification: 'Note Added'})
    return response.redirect(`back`);
  }


  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
