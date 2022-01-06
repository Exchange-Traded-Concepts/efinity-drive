import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";

export default class FundPipeline extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fundId: number
  @belongsTo(()=> Fund)
  public fund : BelongsTo<typeof Fund>

  @column()
  public status: string

  @column()
  public client_questionnaire_sent: DateTime

  @column()
  public client_questionnaire_completed: DateTime

  @column()
  public client_sent_sample_portfolio_data: DateTime

  @column()
  public portfolio_notes: string

  @column()
  public proposal_sent: DateTime

  @column()
  public license_sponsorship: DateTime

  @column()
  public psa_form_sent: DateTime

  @column()
  public psa_form_complete: DateTime

  @column()
  public diligence_sent: DateTime

  @column()
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
