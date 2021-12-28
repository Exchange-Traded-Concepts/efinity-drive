import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Fund from "App/Models/Fund";
import Custodian from "App/Models/Custodian";
import Client from "App/Models/Client";
import Distributor from "App/Models/Distributor";

export default class FundsController {
  public async index({view}: HttpContextContract) {
    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
    const custodians = await Custodian.all()
    const clients = await Client.all()
    const distributors = await Distributor.all()
    const maint = 'show'

    return view.render('maintenance/fund', {funds, custodians, clients, distributors, maint})
  }

  public async show({view}: HttpContextContract) {

    const funds = await Fund.query()
      .preload('client')
      .preload('custodian')
      .preload('distributor')
    return view.render('admin/funds', {funds})

  }

  public async create({  }: HttpContextContract) {


  }

  public async store({request, response, session}: HttpContextContract) {
    const data = await this.validateInput(request)
    await Fund.create({
      fund_name: data.fund_name,
      ticker: data.ticker,
      clientId: data.client_id,
      distributorId: data.distributor_id,
      custodianId : data.custodian_id,
      trust: data.trust,
      fiscal_year_end: data.fiscal_year_end,
      dividend_frequency: data.dividend_frequency,
      fund_website: data.fund_website,
      exchange: data.exchange,
      prospectus_date: data.prospectus_date,
    })
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()

  }



  public async edit({view,params}: HttpContextContract) {
    const funds = await Fund.query().preload('client')
    const custodians = await Custodian.all()
    const clients = await Client.all()
    const distributors = await Distributor.all()
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
      distributorId: data.distributor_id,
      custodianId : data.custodian_id,
      trust: data.trust,
      fiscal_year_end: data.fiscal_year_end,
      dividend_frequency: data.dividend_frequency,
      fund_website: data.fund_website,
      exchange: data.exchange,
      prospectus_date: data.prospectus_date,
    })

    await fund.save()
    session.flash('notification', 'Fund saved.')
    return response.redirect().back()


  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {
    const valSchema = schema.create({
      fund_name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      ticker: schema.string( {trim: true},[rules.maxLength(5), rules.required()]),
      client_id: schema.number( [ rules.required()]),
      distributor_id: schema.number([ rules.required()]),
      custodian_id: schema.number([ rules.required()]),
      trust: schema.string({ trim: true }, [rules.maxLength(100), rules.required()]),
      fiscal_year_end: schema.string({ trim: true }, [rules.maxLength(100), rules.required()]),
      dividend_frequency: schema.string({ trim: true }, [rules.maxLength(100)]),
      fund_website: schema.string({ trim: true }, [rules.maxLength(100)]),
      exchange: schema.string({trim: true}, [rules.maxLength(100)]),
      prospectus_date: schema.string({trim:true}),
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'fund_name.required': 'Fund Name is required',
        'fund_name.maxLength': 'Fund Name allows upto 150 characters',
        'ticker.required': 'Ticker Symbol Required',
        'ticker.maxLength': 'Ticker can only be up to 5 characters',
        'client_id.required': 'A fund must belong to someone',
        'custodian_id.required': 'A fund must have a custodian',
        'distributor_id.required': 'A fund must have a distributor',
        'trust.required': 'Trust is required',
        'fiscal_year_end.required': 'Fiscal Year End required',
        'prospectus_date.required' : 'Prospectus Date required',
        'exchange.maxLength': 'Exchange can only be 100 characters'
      },
    })
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