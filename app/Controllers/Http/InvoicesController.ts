import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Invoice from "App/Models/Invoice";
import Fund from "App/Models/Fund";
import * as console from "console";
import InvoiceTransaction from "App/Models/InvoiceTransaction";
import Database from "@ioc:Adonis/Lucid/Database";
//import * as puppeteer from "puppeteer";
//import Route from "@ioc:Adonis/Core/Route";

export default class InvoicesController {
  public async index({view}: HttpContextContract) {

    const funds = await Fund.query().whereIn('status', ['launched','prelaunch']).orderBy('ticker')

    return view.render('admin/invoice/index', {funds})

  }

  public async admin({view}:HttpContextContract){

    const invoices = await Invoice.query()
      .preload('fund', (assignedToQuery) => {assignedToQuery.preload('client')})
      .orderBy('invoice_date','desc')

    return view.render('admin/invoice/invoice_admin', {invoices})


  }

  public async create({request, session, auth, response}: HttpContextContract) {

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
    const invoice = await Invoice.query().where('id', new_invoice_id[0].id)



    session.flash({notification: 'Invoice Created'})

    return response.redirect().toRoute('InvoicesController.transactions', {id: new_invoice_id[0].id , invoice} )
    //return view.render('admin/invoice/transactions', { invoice, invoice_id: new_invoice_id[0]})
  }

  public async transactions({params, view}: HttpContextContract){

    const invoice = await Invoice.query()
      .preload('fund', (clientQuery) => {clientQuery.preload('client')})
      .preload('createdBy')
      .where('id', params.id)

    const transactions = await InvoiceTransaction.query().where('invoice_id', params.id)

    console.log(transactions)

    return view.render('admin/invoice/transactions', { invoice, invoice_id: params.id, transactions, edit:1})

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

  public async showInvoice({params, view}: HttpContextContract){
    const invoice = await Invoice.query()
      .preload('fund', (q)=>q.preload('client'))
      .where('id', params.id )

    const asset_based = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total   FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'asset_based', params.id]);
    const board_expenses = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ?  AND invoice_id = ?", ['type', 'board_expenses',params.id]);
    const escrow = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'escrow', params.id]);
    const other = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'other', params.id]);

    const sum_type = await Database.rawQuery('SELECT  type, SUM(CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END) AS sum_type FROM invoice_transactions WHERE invoice_id = ? GROUP BY type ', [params.id])
    const transactions = await InvoiceTransaction.query().where('invoice_id', params.id).orderBy('type')
    const total_expenses = await Database.rawQuery('SELECT SUM(CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END) AS total from invoice_transactions WHERE invoice_id =?', [params.id])

    return view.render('admin/invoice/invoice', { invoice, invoice_id: params.id, transactions, total_expenses, asset_based, board_expenses, escrow, other, sum_type})
  }

  public async showInvoice2({params, view}: HttpContextContract){
    const invoice = await Invoice.query()
      .preload('fund', (q)=>q.preload('client'))
      .where('id', params.id )

    const asset_based = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total   FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'asset_based', params.id]);
    const board_expenses = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ?  AND invoice_id = ?", ['type', 'board_expenses',params.id]);
    const escrow = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'escrow', params.id]);
    const other = await Database.rawQuery("SELECT min_payment , calc_payment, type, description, CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END AS col_total FROM invoice_transactions WHERE ?? = ? AND invoice_id = ?", ['type', 'other', params.id]);

    const sum_type = await Database.rawQuery('SELECT  type, SUM(CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END) AS sum_type FROM invoice_transactions WHERE invoice_id = ? GROUP BY type ', [params.id])
    const transactions = await InvoiceTransaction.query().where('invoice_id', params.id).orderBy('type')
    const total_expenses = await Database.rawQuery('SELECT SUM(CASE WHEN calc_payment < 0 THEN calc_payment ELSE GREATEST(min_payment, calc_payment) END) AS total from invoice_transactions WHERE invoice_id =?', [params.id])

    return view.render('admin/invoice/invoice2', { invoice, invoice_id: params.id, transactions, total_expenses, asset_based, board_expenses, escrow, other, sum_type})


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

  public async updateTransactions({params, request, session, response}: HttpContextContract){
    const desc_array = request.input('description')
    const min_payment_array = request.input('min_payment')
    const calc_payment_array = request.input('calc_payment')
    const type_array = request.input('type')
    const qty_array = request.input('qty')
    const invoice_id = request.input('invoice_id')

    let month_end_assets = request.input('month_end_assets').toString().replace(/[^\d.-]/g, '')
    let avg_daily_assets = request.input('avg_daily_assets').toString().replace(/[^\d.-]/g, '')
    let income = request.input('income').toString().replace(/[^\d.-]/g, '')

    await InvoiceTransaction.query().where('invoice_id', params.id).delete()

    for (let i = 1; i < request.input('description').length; i++) {

      console.log(desc_array[i])

      if (desc_array[i] !== null) {

        await InvoiceTransaction.create({
          invoiceId: invoice_id,
          type: type_array[i],
          description: desc_array[i],
          qty: qty_array[i].replace(/[^\d.-]/g, ''),
          min_payment: min_payment_array[i].replace(/[^\d.-]/g, ''),
          calc_payment: calc_payment_array[i].replace(/[^\d.-]/g, '')

        })
      }
    }
    const inv = await Invoice.findOrFail( params.id)

    inv.merge({
      // invoice_for_date: data.invoice_for_date,
      days_in_month: request.input('days_in_month'),
      // invoice_number: data.invoice_number,
      expense_ratio: request.input('exp_ratio'),
      //  attn: data.attn,
      month_end_assets : month_end_assets,
      avg_daily_assets: avg_daily_assets,
      income: income,
      bps: request.input('bps'),
      days_in_year: request.input('days_in_year'),


    })
    await inv.save()
    session.flash('notification', 'Invoice Updated')
    return response.redirect().toRoute('InvoicesController.admin')
  }

  public async update({request, session, response}: HttpContextContract) {

    console.log('HERE')

    const desc_array = request.input('description')
    const min_payment_array = request.input('min_payment')
    const calc_payment_array = request.input('calc_payment')
    const type_array = request.input('type')
    const qty_array = request.input('qty')
    const invoice_id = request.input('invoice_id')

    let month_end_assets = request.input('month_end_assets').toString().replace(/[^\d.-]/g, '')
    let avg_daily_assets = request.input('avg_daily_assets').toString().replace(/[^\d.-]/g, '')
    let income = request.input('income').toString().replace(/[^\d.-]/g, '')

    console.log(request.input('type').length)

    for (let i = 1; i < request.input('description').length; i++) {
      if (desc_array[i] != '') {

        await InvoiceTransaction.create({
          invoiceId: invoice_id,
          type: type_array[i],
          description: desc_array[i],
          qty: qty_array[i].replace(/[^\d.-]/g, ''),
          min_payment: min_payment_array[i].replace(/[^\d.-]/g, ''),
          calc_payment: calc_payment_array[i].replace(/[^\d.-]/g, '')

        })

      }
    }
      const inv = await Invoice.findOrFail( invoice_id)

      inv.merge({
       // invoice_for_date: data.invoice_for_date,
        days_in_month: request.input('days_in_month'),
       // invoice_number: data.invoice_number,
        expense_ratio: request.input('expense_ratio'),
      //  attn: data.attn,
        month_end_assets : month_end_assets,
        avg_daily_assets: avg_daily_assets,
        income: income,
        bps: request.input('bps'),
        days_in_year: request.input('days_in_year'),


      })
      await inv.save()
      session.flash('notification', 'Client Updated')
      return response.redirect('back', )
    //  console.log(desc_array[i] +" "+ min_payment_array[i] +"  "+calc_payment_array[i]+" "+qty_array[i] +" "+type_array[i] + " "+ invoice_id+"<br>")

    }

  public async destroy({}: HttpContextContract) {}

  private async validateInput(request) {

    const valSchema = schema.create({
      fund_id: schema.number([rules.required()]),
      invoice_date: schema.string.nullableAndOptional({trim: true}),
      invoice_for_date: schema.string.nullableAndOptional({trim: true}),
      days_in_month: schema.string.nullableAndOptional({trim: true}),
      invoice_number: schema.string.nullableAndOptional({trim: true}),
      expense_ratio: schema.number.nullableAndOptional([]),
    //  created_by: schema.number([rules.required()]),
      attn: schema.string.nullableAndOptional({trim: true}),
      month_end_assets :schema.number.nullableAndOptional(),
      avg_daily_assets: schema.number.nullableAndOptional(),
      income: schema.number.nullableAndOptional(),
      bps: schema.string.nullableAndOptional({trim: true}),
      days_in_year: schema.number.nullableAndOptional(),
      pdf_url: schema.string.nullableAndOptional({trim: true}),


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


