import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo, hasMany, HasMany, hasManyThrough, HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Client from "App/Models/Client";
import Task from "App/Models/Task";
import SubTask from "App/Models/SubTask";

export default class Fund extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number
  @belongsTo(()=> Client)
  public client : BelongsTo<typeof Client>

  @column()
  public custodian_id: number
  @belongsTo(()=> Client, {
    foreignKey: 'custodian_id',
    localKey: 'id'
  })
  public custodian : BelongsTo<typeof Client>

  @column()
  public distributor_id: number
  @belongsTo(()=> Client, {
    foreignKey: 'distributor_id',
    localKey: 'id'
  })
  public distributor : BelongsTo<typeof Client>

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>

  @column()
  public ticker: string

  @column()
  public trust: string

  @column()
  public fiscal_year_end: string

  @column()
  public dividend_frequency: string

  @column()
  public fund_website: string

  @column()
  public exchange: string

  @column.dateTime()
  public prospectus_date: DateTime

  @column()
  public fund_name: string

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

  @column.dateTime()
  public launch_date: DateTime

  @column.dateTime()
  public sub_advisor_agreement: DateTime

  @column.dateTime()
  public target_launch_date: DateTime

 /* @column()
  public trust_id: number
  @belongsTo(()=> Trust, {
    foreignKey: 'trust_id',
    localKey: 'id'
  })
  public trust : BelongsTo<typeof Trust>
  */
  @column.dateTime()
  public fifteenc_approval : DateTime

  @column()
  public four_eighty_five_status: string

  @column.dateTime()
  public four_eighty_five_effective_date : DateTime

  @column()
  public role : string

  @column.dateTime()
  public pea: DateTime

  @column()
  public notes: string

  @column.dateTime()
  public code_of_ethics_complete : DateTime

  @column()
  public cusip: string

  @column()
  public exp_ratio : number

  @column()
  public admin: string

  @column()
  public management_fee: number

  @column()
  public proxy: string

  @column()
  public color: string

  @column.dateTime()
  public seed_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasManyThrough([
    () => SubTask,
    () => Task
  ])
  public subtasks: HasManyThrough<typeof SubTask>
}
