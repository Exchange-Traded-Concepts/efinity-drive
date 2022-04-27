import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Fund from "App/Models/Fund";
import Client from "App/Models/Client";
import Task from "App/Models/Task";
import Document from "App/Models/Document";
import States from "App/utils/USState";
import TaskStatus from "App/Models/TaskStatus";


export default class FundsController {
  public async index({view}: HttpContextContract) {
    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
    const custodians = await Client.query().where('client_type_id', 3).orderBy('name')
    const clients = await Client.query().where('client_type_id', 1).orderBy('name')
    const distributors = await Client.query().where('client_type_id', 2).orderBy('name')
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
      proxy: data.proxy,
      color: data.color
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

    return view.render('maintenance/fund', { funds, custodians, clients, distributors, maint, c_fund, months: await States.months_list()})
  }

  public async update({params, request, response, session}: HttpContextContract) {

    const fund = await Fund.findOrFail( params.id)
    const data = await this.validateInput(request)

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
      proxy: data.proxy,
      color: data.color
    })

    await fund.save()
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()


  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      fund_name: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(150)]),
      ticker: schema.string.nullableAndOptional( {trim: true},[rules.maxLength(5), rules.required()]),
      client_id: schema.number( [ rules.required()]),
      distributor_id: schema.number.nullableAndOptional(),
      custodian_id: schema.number.nullableAndOptional(),
      trust: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(100)]),
      fiscal_year_end: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(100)]),
      dividend_frequency: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(100)]),
      fund_website: schema.string.nullableAndOptional({ trim: true }, [rules.maxLength(100)]),
      exchange: schema.string.nullableAndOptional({trim: true}, [rules.maxLength(100)]),
      prospectus_date: schema.string.nullableAndOptional({trim:true}),
      status: schema.string.nullableAndOptional({trim:true}),
      client_questionnaire_sent: schema.string.nullableAndOptional({trim:true}),
      client_questionnaire_completed: schema.string.nullableAndOptional({trim:true}),
      client_sent_sample_portfolio_data: schema.string.nullableAndOptional({trim:true}),
      portfolio_notes: schema.string.nullableAndOptional({trim:true}),
      proposal_sent: schema.string.nullableAndOptional({trim:true}),
      license_sponsorship: schema.string.nullableAndOptional({trim:true}),
      psa_form_sent: schema.string.nullableAndOptional({trim:true}),
      psa_form_complete: schema.string.nullableAndOptional({trim:true}),
      diligence_sent: schema.string.nullableAndOptional({trim:true}),
      diligence_received: schema.string.nullableAndOptional({trim:true}),
      strategy: schema.string.nullableAndOptional({trim:true}),
      sec_comments:schema.string.nullableAndOptional({trim:true}),
      launch_date: schema.string.nullableAndOptional({trim:true}),
      fifteenc_approval : schema.string.nullableAndOptional({trim:true}),
      four_eighty_five_status: schema.string.nullableAndOptional({trim:true}),
      four_eighty_five_effective_date : schema.string.nullableAndOptional({trim:true}),
      role : schema.string.nullableAndOptional({trim:true}),
      pea: schema.string.nullableAndOptional({trim:true}),
      notes: schema.string.nullableAndOptional({trim:true}),
      sub_advisor_agreement: schema.string.nullableAndOptional({trim:true}),
      target_launch_date: schema.string.nullableAndOptional({trim:true}),
      cusip: schema.string.nullableAndOptional({trim:true}),
      exp_ratio: schema.number.nullableAndOptional(),
      admin: schema.string.nullableAndOptional({trim:true}),
      proxy: schema.string.nullableAndOptional({trim:true}),
      management_fee: schema.string.nullableAndOptional(),
      color: schema.string.nullableAndOptional()

       })

    return await request.validate({
      schema: valSchema,
      messages: {
        'fund_name.maxLength': 'Fund Name allows upto 150 characters',
      },
    })
  }

  public async details({params, view}: HttpContextContract){

    if (params.ticker){
      const f = await Fund.query().where('ticker', params.ticker )
      params.id = f[0].id
    }


    const p = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
      .where('id', params.id)

    const tasks = await Task.query()
      .preload('createdBy')
      .preload('subtasks', (assignedToQuery) => {assignedToQuery.preload('assignedTo').preload('createdBy').preload('taskStatus')})
      .preload('assignedTo')
      .preload('createdBy')
      .preload('taskStatus')
      .where('fund_id', params.id)
      .orderBy('target_completion_date')

    const status = await TaskStatus.query().orderBy('rank')

    const docs = await Document.query().preload('createdBy')
      .where('resource_id', params.id).andWhere('doc_type_id', 2)

    const fund_id = params.id

    return view.render('admin/pipeline_details', {p, tasks, fund_id, docs, status})


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
