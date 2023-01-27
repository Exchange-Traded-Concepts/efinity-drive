import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Invoice from "App/Models/Invoice";

export default class InvoiceTransaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceId: number
  @belongsTo(()=> Invoice)
  public invoice : BelongsTo<typeof Invoice>

  @column()
  public transaction_type: string

  @column()
  public description: string

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
