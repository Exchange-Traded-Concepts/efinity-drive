import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";
import users from "App/Models/users";

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fundId: number
  @belongsTo(()=> Fund)
  public fund : BelongsTo<typeof Fund>

  @column.dateTime({ autoCreate: true })
  public invoice_date: DateTime

  @column.dateTime({ autoCreate: true })
  public invoice_for_date: DateTime

  @column()
  public days_in_month: number

  @column()
  public invoice_number: string

  @column()
  public expense_ratio: number

  @column()
  public attn:string

  @column()
  public month_end_assets: number

  @column()
  public avg_daily_assets: number

  @column()
  public income: number

  @column()
  public bps: string

  @column()
  public days_in_year: number

  @column()
  public pdf_url: string

  @column()
  public created_by: number
  @belongsTo(()=> users, {
    foreignKey: 'created_by',
    localKey: 'id'
  })
  public createdBy : BelongsTo<typeof users>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
