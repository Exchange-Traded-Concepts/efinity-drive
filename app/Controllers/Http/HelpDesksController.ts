import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpDesk from "App/Models/HelpDesk";
import HelpDeskComment from "App/Models/HelpDeskComment";
import EFMailer from "App/utils/mailer";

export default class HelpDesksController {
  public async index({view}: HttpContextContract) {
    const tickets = '';
    return view.render('admin/helpdesk', {tickets});

  }

  public async create({}: HttpContextContract) {}

  public async store({session, response, request, auth}: HttpContextContract) {

    try {

      await HelpDesk.create({
        subject: request.input('subject'),
        issue: request.input('issue'),
        priority: request.input('priority'),//data.public,
        doc: request.input('doc'),
        groups_id: 1,
        // @ts-ignore
        created_by: auth.user.id,
        status: 'open',
      })
    }
  catch (e) {
    return response.abort(e)
  }

    const mailTo = await EFMailer.getUserEmail(1)

    await EFMailer.email(mailTo, 'Help Desk Ticket', 'emails/helpdesk',
      {
        issue : request.input('issue'),
        subject: request.input('subject'),
        priority: request.input('priority'),
        // @ts-ignore
        created_by: auth.user.first_name + ' ' + auth.user.last_name
      })

    session.flash({notification: 'Ticket Added'})
    return response.redirect(`back`);

  }

  public async show({}: HttpContextContract) {}

  public async view({ view, params}: HttpContextContract) {

    const ticket = await HelpDesk.query()
      .preload('helpdeskcomment', (createdQuery) => {createdQuery.preload('createdBy').orderBy('id', 'desc')})
      .preload('createdBy')
      .where('id', params.id)
      .orderBy('id')
    console.log(ticket)
    return view.render('maintenance/helpdesk_ticket_view', {ticket})
  }

  public async add_comment({request, auth, session, response} : HttpContextContract) {

    await HelpDeskComment.create({
      comment: request.input('comment'),
      helpDeskId: request.input('help_desk_id'),
      // @ts-ignore
      created_by: auth.user.id
    })

    const ticket = await HelpDesk.query().where('id', request.input('help_desk_id'))
      .preload('createdBy')

    const admin = await EFMailer.getUserEmail(1)
    const mailTo = admin+','+ ticket[0].createdBy.email
    await EFMailer.email(mailTo, 'Help Desk Ticket', 'emails/helpdesk_comment',
      {
        issue : ticket[0].issue,
        subject: ticket[0].subject,
        priority: ticket[0].priority,
        comment: request.input('comment'),
        created_by: auth.user?.first_name + ' ' + auth.user?.last_name
      })

    session.flash({notification: 'Comment Added'})
    return response.redirect(`back`);

  }

  public async admin({view}: HttpContextContract){
    const tickets = await HelpDesk.query().orderBy('status', 'desc').orderBy('updatedAt')
    return view.render('admin/helpdesk_admin', {tickets})
  }

  public async close({request, session, response}: HttpContextContract){
    const ticket = await HelpDesk.findOrFail(request.input('help_desk_id'))

    ticket.merge({
      status: 'closed',
    })
    await ticket.save()

    session.flash({notification: 'Ticket Closed'})
    return response.redirect(`back`);

  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
