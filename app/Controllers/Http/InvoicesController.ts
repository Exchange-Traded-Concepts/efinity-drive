import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Invoice from "App/Models/Invoice";
import Fund from "App/Models/Fund";
import * as console from "console";
//import * as puppeteer from "puppeteer";
//import Route from "@ioc:Adonis/Core/Route";

export default class InvoicesController {
  public async index({view}: HttpContextContract) {

    const funds = await Fund.query().whereIn('status', ['launched','prelaunch']).orderBy('ticker')

    return view.render('admin/invoice/index', {funds})

  }

  public async create({request, session, auth, response}: HttpContextContract) {

    console.log('HERE in Invoice ')

    const data = await this.validateInput(request)


    await Invoice.create({
      fundId: data.fund_id,
      invoice_date: data.invoice_date,
      invoice_for_date: data.invoice_for_date,
      days_in_month: data.days_in_month,
      invoice_number: data.invoice_number,
     // expense_ratio: data.expense_ratio,
      // @ts-ignore
      created_by: auth.user.id

    })
    //Once created move the page with the invoice details
    const new_invoice_id = await Invoice.query().max({'id': 'id'})



    session.flash({notification: 'Invoice Created'})

    return response.redirect().toRoute('InvoicesController.transactions', {id: new_invoice_id[0].id } )
    //return view.render('admin/invoice/transactions', { invoice, invoice_id: new_invoice_id[0]})
  }

  public async transactions({params, view}: HttpContextContract){

    const invoice = await Invoice.query()
      .preload('fund', (clientQuery) => {clientQuery.preload('client')})
      .preload('createdBy')
      .where('id', params.id)

    return view.render('admin/invoice/transactions', { invoice, invoice_id: params.id})

  }
  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {
/*
    const options = { expiresIn: '3m', invoice_id: params.id }
    const path = Route.makeSignedUrl('pdf.invoice', params, options)
    const signedInvoicePath = path
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.emulateMediaType('screen')
    await page.goto(`http://localhost:3333${signedInvoicePath}`, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({ format: 'a4' })
    console.log(pdf)
    return view.render('admin/invoice/invoice')

 */
  }

  public async generate({ request, response, view}: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.badRequest('The route signature is invalid')
    }
   // const recipient = request.qs().recipient
   // const user = await users.findOrFail(params.uid)

    return view.render('invoice', {})
  }

  public async send({ response }: HttpContextContract) {

      return response.redirect().toPath('/')
  }


  public async edit({}: HttpContextContract) {}

  public async update({request}: HttpContextContract) {

    console.log('HERE')

    const desc_array = request.input('description')
    const amount_array = request.input('amount')
    const type_array = request.input('expense_type')
    const invoice_id = request.input('invoice_id')

    for (let i = 1; i < request.input('description').length; i++) {
      console.log(desc_array[i] +" "+ amount_array[i] +"  "+type_array[i] + " "+ invoice_id+"<br>")

    }


  }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {

    const valSchema = schema.create({
      fund_id: schema.number([rules.required()]),
      invoice_date: schema.string.nullableAndOptional({trim: true}),
      invoice_for_date: schema.string.nullableAndOptional({trim: true}),
      days_in_month: schema.string.nullableAndOptional({trim: true}),
      invoice_number: schema.string.nullableAndOptional({trim: true}),
    //  expense_ratio: schema.number([rules.required()]),
    //  created_by: schema.number([rules.required()]),
   //   attn: schema.string.nullableAndOptional({trim: true}),

    })
    return await request.validate({
      schema: valSchema,
      messages: {
        'fund_id.required': 'Fund is required',
        'expense_ratio.required': 'EXP. Ratio is required',
      },
    })
  }
}


