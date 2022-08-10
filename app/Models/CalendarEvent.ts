import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";

export default class CalendarEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public start_date: DateTime

  @column.dateTime()
  public end_date: DateTime

  @column()
  public public: boolean

  @column()
  public title: string

  @column()
  public type: string

  @column()
  public notes: string

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
