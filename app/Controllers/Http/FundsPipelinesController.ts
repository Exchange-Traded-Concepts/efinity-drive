import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fundPipeline from "App/Models/FundPipeline";
import Fund from "App/Models/Fund";
import Database from "@ioc:Adonis/Lucid/Database";
import Task from "App/Models/Task";
import FundDocument from "App/Models/FundDocument";



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
      fund_id: request.input('fund_id'),
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

  public async show({view, params}: HttpContextContract){
    const pipefunds = await fundPipeline.query()
      .preload('fund').where('status', params.status)
    const pipe = 'show'
    const status = params.status
    if (params.status === 'prelaunch'){
      return view.render('admin/fundpipeline_prelaunch', {pipefunds, pipe, status})
    }
    else if(params.status === 'prospect'){
      return view.render('admin/fundpipeline_prospect', {pipefunds, pipe , status})
    }
    else if(params.status === 'launched'){
      return view.render('admin/fundpipeline_launched', {pipefunds, pipe , status})
    }
    else if(params.status === 'other'){
      return view.render('admin/fundpipeline_other', {pipefunds, pipe , status})
    }
  }

  public async edit({view, params}: HttpContextContract) {
    const pipefund = await fundPipeline.findBy('id',params.id)
    const funds = await Fund.all();

    return view.render('maintenance/fundpipeline', {pipefund, funds })
  }

  public async update({request, view, params}: HttpContextContract) {
    const  funds = await Fund.all();
    const fundpipeline = await fundPipeline.findOrFail( params.id)
    const pipefunds = await fundPipeline.all()

    fundpipeline.merge({
      fund_id: request.input('fund_id'),
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
    return  view.render('admin/fundpipeline', {pipefunds, funds})
  }

  public async destroy({params, session, response}: HttpContextContract) {
    const pipefund = await fundPipeline.findOrFail(params.id)
    await pipefund.delete()
    session.flash('notification', 'Fund Pipeline Deleted')

    return response.redirect('back')

  }

  public async details({params, view}: HttpContextContract){
     let p = await Database.rawQuery('SELECT clients.*, funds.*, fp.id, fp.fund_id, fp.status, DATE_FORMAT(fp.client_questionnaire_sent, "%c/%e/%Y") as cqs,' +
       ' DATE_FORMAT(fp.client_questionnaire_completed, "%c/%e/%Y") as cqc, DATE_FORMAT(fp.client_sent_sample_portfolio_data, "%c/%e/%Y") as csspd,' +
       ' fp.portfolio_notes, DATE_FORMAT(fp.proposal_sent, "%c/%e/%Y") as proposal_sent , DATE_FORMAT(fp.license_sponsorship, "%c/%e/%Y") as license_sponsorship,' +
       '  DATE_FORMAT(fp.psa_form_sent, "%c/%e/%Y") as pfs, DATE_FORMAT(fp.psa_form_complete, "%c/%e/%Y") as pfc, ' +
       'DATE_FORMAT(fp.diligence_sent, "%c/%e/%Y") as ds, DATE_FORMAT(fp.diligence_received, "%c/%e/%Y") as dr, DATE_FORMAT(fp.launch_date, "%c/%e/%Y") as ld,' +
       'fp.strategy, fp.sec_comments, notes FROM fund_pipelines fp, clients, funds WHERE fp.fund_id = funds.id AND funds.client_id = clients.id AND funds.id =? ', [params.id]
     )
    p = p[0][0]

    const tasks = await Task.query()
      .preload('assignedTo')
      .preload('createdBy')
      .preload('subtasks')
      .where('fund_id', params.id)


    const docs = await FundDocument.query().preload('createdBy')
            .where('fund_id', params.id)

    const fund_id = params.id

    console.log(tasks)
    return view.render('admin/pipeline_details', {p, tasks, fund_id, docs})


  }
}
