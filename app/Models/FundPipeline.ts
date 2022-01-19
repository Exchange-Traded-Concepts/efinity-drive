import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";
import Trust from "App/Models/Trust";

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

  @column.dateTime()
  public sub_advisor_agreement: DateTime

  @column.dateTime()
  public target_launch_date: DateTime

  @column()
  public trust_id: number
  @belongsTo(()=> Trust, {
    foreignKey: 'trust_id',
    localKey: 'id'
  })
  public trust : BelongsTo<typeof Trust>

  @column.dateTime()
  public fifteenc_approval : DateTime

  @column()
  public four_ninety_five_status: string

  @column.dateTime()
  public four_ninety_five_effective_date : DateTime

  @column()
  public role : string

  @column.dateTime()
  public code_of_ethics_complete : DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
