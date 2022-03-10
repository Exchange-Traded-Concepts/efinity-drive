import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Fund from "App/Models/Fund";
import Client from "App/Models/Client";
import Task from "App/Models/Task";
import FundDocument from "App/Models/FundDocument";
import States from "App/utils/USState";


export default class FundsController {
  public async index({view}: HttpContextContract) {
    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
    const custodians = await Client.query().where('client_type_id', 3)
    const clients = await Client.query().where('client_type_id', 1)
    const distributors = await Client.query().where('client_type_id', 2)
    const maint = 'show'

    return view.render('maintenance/fund', {funds, custodians, clients, distributors, maint, months: await States.months_list()})
  }

  public async show({view}: HttpContextContract) {

    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')

    return view.render('admin/funds', {funds})

  }

  public async showPipeline({view, params}: HttpContextContract) {

    const pipefunds = await Fund.query()
      .preload('client')
      .preload('client')
      .preload('custodian')
      .preload('distributor')
      .where('status', params.status)
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

  public async create({  }: HttpContextContract) {


  }

  public async store({request, response, session}: HttpContextContract) {
    const data = await this.validateInput(request)
    await Fund.create({
      fund_name: data.fund_name,
      ticker: data.ticker,
      clientId: data.client_id,
      distributor_id: data.distributor_id,
      custodian_id : data.custodian_id,
      trust: data.trust,
      fiscal_year_end: data.fiscal_year_end,
      dividend_frequency: data.dividend_frequency,
      fund_website: data.fund_website,
      exchange: data.exchange,
      prospectus_date: data.prospectus_date,

      status: data.status,
      client_questionnaire_sent: data.client_questionnaire_sent,
      client_questionnaire_completed: data.client_questionnaire_completed,
      client_sent_sample_portfolio_data: data.client_sent_sample_portfolio_data,
      portfolio_notes: data.portfolio_notes,
      proposal_sent: data.proposal_sent,
      license_sponsorship: data.license_sponsorship,
      psa_form_sent: data.psa_form_sent,
      psa_form_complete: data.psa_form_complete,
      diligence_sent: data.diligence_sent,
      diligence_received: data.diligence_received,
      strategy: data.strategy,
      sec_comments:data.sec_comments,
      launch_date: data.launch_date,
      fifteenc_approval : data.fifteenc_approval,
      four_eighty_five_status: data.four_eighty_five_status,
      four_eighty_five_effective_date : data.four_eighty_five_effective_date,
      role : data.role,
      pea: data.pea,
      notes: data.notes,
      sub_advisor_agreement: data.sub_advisor_agreement,
      target_launch_date: data.target_launch_date,
      cusip: data.cusip,
      exp_ratio: data.exp_ratio,
      admin: data.admin,
      management_fee : data.management_fee,
      proxy: data.proxy
    })
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()

  }



  public async edit({view,params}: HttpContextContract) {
    const funds = await Fund.query().preload('client')
    const custodians = await Client.query().where('client_type_id', 3)
    const clients = await Client.query().where('client_type_id', 1)
    const distributors = await Client.query().where('client_type_id', 2)
    const maint = 'show'
    const c_fund = await Fund.findOrFail(params.id)
    const p_date = await this.short_date(c_fund.prospectus_date)
    //@ts-ignore
    c_fund.prospectus_date = p_date
  //  console.log(p_date)
    return view.render('maintenance/fund', { funds, custodians, clients, distributors, maint, c_fund})
  }

  public async update({params, request, response, session}: HttpContextContract) {
    const fund = await Fund.findOrFail( params.id)
    const data = await this.validateInput(request)

    console.log(data.prospectus_date)

    fund.merge({
      fund_name: data.fund_name,
      ticker: data.ticker,
      clientId: data.client_id,
      distributor_id: data.distributor_id,
      custodian_id : data.custodian_id,
      trust: data.trust,
      fiscal_year_end: data.fiscal_year_end,
      dividend_frequency: data.dividend_frequency,
      fund_website: data.fund_website,
      exchange: data.exchange,
      prospectus_date: data.prospectus_date,

      status: data.status,
      client_questionnaire_sent: data.client_questionnaire_sent,
      client_questionnaire_completed: data.client_questionnaire_completed,
      client_sent_sample_portfolio_data: data.client_sent_sample_portfolio_data,
      portfolio_notes: data.portfolio_notes,
      proposal_sent: data.proposal_sent,
      license_sponsorship: data.license_sponsorship,
      psa_form_sent: data.psa_form_sent,
      psa_form_complete: data.psa_form_complete,
      diligence_sent: data.diligence_sent,
      diligence_received: data.diligence_received,
      strategy: data.strategy,
      sec_comments:data.sec_comments,
      launch_date: data.launch_date,
      fifteenc_approval : data.fifteenc_approval,
      four_eighty_five_status: data.four_eighty_five_status,
      four_eighty_five_effective_date : data.four_eighty_five_effective_date,
      role : data.role,
      pea: data.pea,
      notes: data.notes,
      sub_advisor_agreement: data.sub_advisor_agreement,
      target_launch_date: data.target_launch_date,
      cusip: data.cusip,
      exp_ratio: data.exp_ratio,
      admin: data.admin,
      management_fee : data.management_fee,
      proxy: data.proxy

    })

    await fund.save()
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()


  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      fund_name: schema.string.optional({ trim: true }, [rules.maxLength(150)]),
      ticker: schema.string.optional( {trim: true},[rules.maxLength(5), rules.required()]),
      client_id: schema.number( [ rules.required()]),
      distributor_id: schema.number.optional(),
      custodian_id: schema.number.optional(),
      trust: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      fiscal_year_end: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      dividend_frequency: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      fund_website: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
      exchange: schema.string.optional({trim: true}, [rules.maxLength(100)]),
      prospectus_date: schema.string.optional({trim:true}),

      status: schema.string.optional({trim:true}),
      client_questionnaire_sent: schema.string.optional({trim:true}),
      client_questionnaire_completed: schema.string.optional({trim:true}),
      client_sent_sample_portfolio_data: schema.string.optional({trim:true}),
      portfolio_notes: schema.string.optional({trim:true}),
      proposal_sent: schema.string.optional({trim:true}),
      license_sponsorship: schema.string.optional({trim:true}),
      psa_form_sent: schema.string.optional({trim:true}),
      psa_form_complete: schema.string.optional({trim:true}),
      diligence_sent: schema.string.optional({trim:true}),
      diligence_received: schema.string.optional({trim:true}),
      strategy: schema.string.optional({trim:true}),
      sec_comments:schema.string.optional({trim:true}),
      launch_date: schema.string.optional({trim:true}),
      fifteenc_approval : schema.string.optional({trim:true}),
      four_eighty_five_status: schema.string.optional({trim:true}),
      four_eighty_five_effective_date : schema.string.optional({trim:true}),
      role : schema.string.optional({trim:true}),
      pea: schema.string.optional({trim:true}),
      notes: schema.string.optional({trim:true}),
      sub_advisor_agreement: schema.string.optional({trim:true}),
      target_launch_date: schema.string.optional({trim:true}),
      cusip: schema.string.optional({trim:true}),
      exp_ratio: schema.number.optional(),
      admin: schema.string.optional({trim:true}),
      proxy: schema.string.optional({trim:true}),
      management_fee: schema.string.optional(),

       })

    return await request.validate({
      schema: valSchema,
      messages: {
        'fund_name.maxLength': 'Fund Name allows upto 150 characters',
      },
    })
  }

  public async details({params, view}: HttpContextContract){
  /*  let p = await Database.rawQuery('SELECT clients.*, funds.*, fp.id, fp.fund_id, fp.status, DATE_FORMAT(fp.client_questionnaire_sent, "%c/%e/%Y") as cqs,' +
      ' DATE_FORMAT(fp.client_questionnaire_completed, "%c/%e/%Y") as cqc, DATE_FORMAT(fp.client_sent_sample_portfolio_data, "%c/%e/%Y") as csspd,' +
      ' fp.portfolio_notes, DATE_FORMAT(fp.proposal_sent, "%c/%e/%Y") as proposal_sent , DATE_FORMAT(fp.license_sponsorship, "%c/%e/%Y") as license_sponsorship,' +
      '  DATE_FORMAT(fp.psa_form_sent, "%c/%e/%Y") as pfs, DATE_FORMAT(fp.psa_form_complete, "%c/%e/%Y") as pfc, ' +
      'DATE_FORMAT(fp.diligence_sent, "%c/%e/%Y") as ds, DATE_FORMAT(fp.diligence_received, "%c/%e/%Y") as dr, DATE_FORMAT(fp.launch_date, "%c/%e/%Y") as ld,' +
      'fp.strategy, fp.sec_comments, notes FROM fund_pipelines fp, clients, funds WHERE fp.fund_id = funds.id AND funds.client_id = clients.id AND funds.id =? ', [params.id]
    )
    p = p[0][0]
*/

    const p = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
      .where('id', params.id)

    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy')})
      .preload('assignedTo')
      .preload('createdBy')
      .where('fund_id', params.id)
      .orderBy('target_completion_date')

    const docs = await FundDocument.query().preload('createdBy')
      .where('fund_id', params.id)

    const fund_id = params.id

    return view.render('admin/pipeline_details', {p, tasks, fund_id, docs})


  }

 public async short_date(return_date) {
   let date = new Date(return_date);
   let year = date.getFullYear();
   let month = date.getMonth() + 1;
   let dt = date.getDate();
   //@ts-ignore
   dt = dt.toString().padStart(2, '0');
   //@ts-ignore
   month = month.toString().padStart(2, '0');
   return year + '-' + month + '-' + dt
 }

}
