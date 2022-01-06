import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";
import Fund from "App/Models/Fund";

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public assignedTo: number
  @belongsTo(()=> users)
  public assigned_to : BelongsTo<typeof users>

  @column()
  public fundId: number
  @belongsTo(()=> Fund)
  public fund_id : BelongsTo<typeof Fund>

  @column()
  public createdBy: number
  @belongsTo(()=> users)
  public created_by : BelongsTo<typeof users>

  @column()
  public target_completion_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
