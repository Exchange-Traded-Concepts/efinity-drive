import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Invoice from "App/Models/Invoice";

export default class InvoiceTransaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceId: number
  @belongsTo(()=> Invoice)
  public invoice_id : BelongsTo<typeof Invoice>

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public qty: number

  @column()
  public min_payment: number

  @column()
  public calc_payment: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
