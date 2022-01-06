import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fundPipeline from "App/Models/FundPipeline";
import Fund from "App/Models/Fund";


export default class FundsPipelinesController {
  public async index({view}: HttpContextContract) {
    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')

    const pipelinefunds = fundPipeline.all()

    return view.render('maintenance/fundpipeline', {funds, pipelinefunds})
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response, session}: HttpContextContract) {
    await fundPipeline.create({
      fundId: request.input('fund_id'),
      status: request.input('status'),
      client_questionnaire_sent: request.input('client_questionnaire_sent'),
      client_questionnaire_completed: request.input('client_questionnaire_completed'),
      client_sent_sample_portfolio_data: request.input('client_sent_sample_portfolio_data'),
      portfolio_notes: request.input('portfolio_notes'),
      proposal_sent: request.input('proposal_sent'),
      license_sponsorship: request.input('license_sponsorship'),
      psa_form_sent: request.input('psa_form_sent'),
      psa_form_complete: request.input('psa_form_sent'),
      diligence_sent: request.input('diligence_sent'),
      diligence_received: request.input('diligence_received'),
      strategy: request.input('strategy'),
      sec_comments:request.input('sec_comments'),
      launch_date: request.input('launch_date'),
    })

    session.flash({notification: 'Project Added'})
    return response.redirect('back')
  }

  public async show({view}: HttpContextContract){
    const pipefunds = await fundPipeline.query()
      .preload('fund')

    return view.render('admin/fundpipeline', {pipefunds})
}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async details({params, view}: HttpContextContract){
    //const p = await fundPipeline.findOrFail(params.id).preload('fund')

    const p = await fundPipeline.query().preload('fund', (pipelineQuery) => {
      pipelineQuery.where('id', params.id)
    })
    console.log(p[0])

    return view.render('admin/pipeline_details', {p})


  }
}
