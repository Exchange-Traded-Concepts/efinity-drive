import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";

export default class PasswordResetToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token : string

  @column()
  public usersId: number
  @belongsTo(()=> users)
  public user : BelongsTo<typeof users>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
