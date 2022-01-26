import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";
import users from "App/Models/users";

export default class FundDocument extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fundId: number
  @belongsTo(()=> Fund)
  public fund : BelongsTo<typeof Fund>

  @column()
  public name: string

  @column()
  public url: string

  @column()
  public size : string

  @column()
  public type : string

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
