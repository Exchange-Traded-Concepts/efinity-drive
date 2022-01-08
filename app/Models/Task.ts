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
  public assigned_to : number
  @belongsTo(()=> users, {
    foreignKey: 'assigned_to',
    localKey: 'id'
  })
  public assignedTo : BelongsTo<typeof users>

  @column()
  public fundId: number
  @belongsTo(()=> Fund)
  public fund_id : BelongsTo<typeof Fund>

  @column()
  public created_by: number
  @belongsTo(()=> users, {
    foreignKey: 'created_by',
    localKey: 'id'
  })
  public createdBy : BelongsTo<typeof users>

  @column.dateTime()
  public target_completion_date: DateTime

  @column.dateTime()
  public completion_date: DateTime

  @column()
  public completed: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
