import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";

export default class FundPipeline extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fund_id: number
  @belongsTo(()=> Fund, {
    foreignKey: 'fund_id',
    localKey: 'id'
  })
  public fund : BelongsTo<typeof Fund>

  @column()
  public status: string

  @column.dateTime()
  public client_questionnaire_sent: DateTime

  @column.dateTime()
  public client_questionnaire_completed: DateTime

  @column.dateTime()
  public client_sent_sample_portfolio_data: DateTime

  @column()
  public portfolio_notes: string

  @column.dateTime()
  public proposal_sent: DateTime

  @column.dateTime()
  public license_sponsorship: DateTime

  @column.dateTime()
  public psa_form_sent: DateTime

  @column.dateTime()
  public psa_form_complete: DateTime

  @column.dateTime()
  public diligence_sent: DateTime

  @column.dateTime()
  public diligence_received: DateTime

  @column()
  public strategy: string

  @column()
  public sec_comments: string

  @column()
  public launch_date: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
