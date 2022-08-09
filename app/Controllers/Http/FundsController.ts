import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Fund from "App/Models/Fund";
import Client from "App/Models/Client";
import Task from "App/Models/Task";
import Document from "App/Models/Document";
import States from "App/utils/USState";
import TaskStatus from "App/Models/TaskStatus";
import SubTask from "App/Models/SubTask";
import EFMailer from "App/utils/mailer";
import Env from "@ioc:Adonis/Core/Env";

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

  public async store({request, response, session, auth}: HttpContextContract) {
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
      color: data.color,
      code_of_ethics_complete: data.code_of_ethics_complete,
      seed_date: data.seed_date
    })

    let f = await Fund.query().orderBy('id', 'desc')

    let fund_id = f[0].id


    await Task.create({
      title: 'Pre-PEA',
      description:'All the sub-tasks that need to be completed prior to executing the PSA',
      // @ts-ignore
      assigned_to_group_id: 6,
      // @ts-ignore
      created_by : auth.user.id,
      fundId: fund_id,
      target_completion_date: request.input('target_launch_date'),
      task_statuses_id: 1

    })

    let t = await Task.query().orderBy('id', 'desc')

    let task_id = t[0].id

    console.log('TASK')
    console.log(task_id)
    console.log('END')

    await SubTask.createMany([
      {
        title: 'Conflict with existing products',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
          title: 'Welcome packet sent',
        assigned_to_group_id: 4,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Questionnaire received',
        assigned_to_group_id: 4,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Sponsor background check',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Portfolio review (including diversification, liquidity analysis) ',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Derivatives review (if necessary) ',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'New Activity Review and Signoff',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Special tax considerations',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Ticker obtained',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'PSA executed',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        task_id : task_id,
        target_completion_date: request.input('target_launch_date'),
        notes: 'Auto Created',
        task_statuses_id : 1,
      },

      ])

    let date = request.input('target_launch_date')

    await this.prePsa(date, fund_id, auth)
    await this.prefifteenc(date, fund_id, auth)

   const mailstring = await EFMailer.getEmailByGroupArray([2,4,5,6,7,9])

    console.log(mailstring)

    //const mailto = emails.toString()
    let name = request.input('fund_name')
    const base_url = Env.get('URL')
    await EFMailer.email(mailstring, 'New Fund Created', 'emails/new_fund', {
      name: name,
      fund_id : fund_id,
      url: base_url
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
      color: data.color,
      code_of_ethics_complete: data.code_of_ethics_complete,
      seed_date : data.seed_date
    })

    await fund.save()
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()


  }

  public async prePsa(date, fund_id, auth){
    await Task.create({
      title: 'Pre-PSA',
      description:'All the sub-tasks that need to be completed prior to executing the PSA',
      // @ts-ignore
      assigned_to_group_id: 6,
      // @ts-ignore
      created_by : auth.user.id,
      fundId: fund_id,
      target_completion_date: date,
      task_statuses_id: 1

    })

    let t = await Task.query().orderBy('id', 'desc')

    let task_id = t[0].id

    await SubTask.createMany([
      {
        title: 'Term Sheet Complete',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Client presentation complete',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date:date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'MLB notified to draft prospectus',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Marketing plans',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      }

    ])
  }

  public async prefifteenc(date, fund_id, auth){
    await Task.create({
      title: 'Pre 15(C)',
      description:'All the sub-tasks that need to be completed prior to executing the 15(C)',
      // @ts-ignore
      assigned_to_group_id: 6,
      // @ts-ignore
      created_by : auth.user.id,
      fundId: fund_id,
      target_completion_date: date,
      task_statuses_id: 1

    })

    let t = await Task.query().orderBy('id', 'desc')

    let task_id = t[0].id

    await SubTask.createMany([
      {
        title: 'On-Site Diligence Review (if client trading) ',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: '485(a) filed',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date:date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Code of Ethics Reviewed',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'SEC comments received',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Responded to SEC comments',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Profitability analysis',
        assigned_to_group_id: 7,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Mini 15(c) response',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'License/Sponsor/Subadviser Agreement negotiated',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'ISS Comps Received',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },


    ])
  }

  public async seedFinal(date, fund_id, auth){
    await Task.create({
      title: 'Seed Finalized',
      description:'Seed Finalized',
      // @ts-ignore
      assigned_to_group_id: 6,
      // @ts-ignore
      created_by : auth.user.id,
      fundId: fund_id,
      target_completion_date: date,
      task_statuses_id: 1

    })

    let t = await Task.query().orderBy('id', 'desc')

    let task_id = t[0].id

    await SubTask.createMany([
      {
        title: 'Lead Market Maker Finalized',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Index SFTP setup complete',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Trading counterparties have SSI’s for all markets',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Request Outstanding Items and Exhibits from MLB 7-10 days prior to going effective ',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Review the Investment Advisory Agreement – Schedule',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Request the New Fund Addendum from the admin 7-10 days prior to going effective ',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Testing has been conducted on the Cr/Rd process, pcf basket upload',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Trading Agreements in Place',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'CU Size',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'NAV set',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Exchange Listing Application (incl. Index Rep Letter, if needed)',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Sample portfolio/index Constituent File',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Website (Marketing responsibility)',
        assigned_to_group_id: 1,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Website URL',
        assigned_to_group_id: 1,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Website URL/800 number/email',
        assigned_to_group_id: 3,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Broker Setup',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'LMM/AP Due Diligence',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: '485B Filing (Final prospectus)',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: '8-A filing',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Sole/Initial Shareholder Consent ',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created - request from MLB at least two weeks prior to launch',
        task_statuses_id : 1,
      },
      {
        title: 'Dividend Distribution Schedule',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Proxy Voting Setup',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Selection of Proxy Voting Guidelines (ESG)',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Final Prospectus & SAI has been reviewed and approved by Sponsor',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Create/Redeem fees finalized',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Website created and reviewed and approved by FINRA',
        assigned_to_group_id: 3,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Rebalance Dates and Frequency confirmed and coded',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'All international markets have been opened, if needed',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'If international, standing instructions set on FX',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Compliance Checks in RATL have been set up and reviewed against Pro and SAI',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Complete attribute sheet received',
        assigned_to_group_id: 9,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Confirm no material changes to portfolio since initial portfolio review',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Sponsor has received marketing training from distributor',
        assigned_to_group_id: 3,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Set up Liquidity Risk Reporting with Vendor if not in-kind and/or Derivatives Risk Reporting, if applicable',
        assigned_to_group_id: 2,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Initiate Initial Seed Investment. 2-3 days prior to launch e',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Relay offering costs to the administrator for non-unitary fee funds only',
        assigned_to_group_id: 6,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'Sublicense Agreement signed',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'PSA executed',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },
      {
        title: 'License / Subadvisory Agreement executed',
        assigned_to_group_id: 5,
        // @ts-ignore
        created_by: auth.user.id,
        taskId : task_id,
        target_completion_date: date,
        notes: 'Auto Created',
        task_statuses_id : 1,
      },

  ])

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
      color: schema.string.nullableAndOptional(),
      code_of_ethics_complete: schema.string.nullableAndOptional({trim:true}),
      seed_date: schema.string.nullableAndOptional({trim:true}),
       })

    return await request.validate({
      schema: valSchema,
      messages: {
        'fund_name.maxLength': 'Fund Name allows upto 150 characters',
      },
    })
  }

  public async details({params, view, session}: HttpContextContract){

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
    const user_groups = session.get('user_groups')

    return view.render('admin/pipeline_details', {user_groups, p, tasks, fund_id, docs, status})


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
