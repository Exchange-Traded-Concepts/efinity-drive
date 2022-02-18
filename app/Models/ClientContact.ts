import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Client from "App/Models/Client";

export default class ClientContact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number
  @belongsTo(()=> Client)
  public client : BelongsTo<typeof Client>

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public role : string

  @column()
  public email : string

  @column()
  public phone : string

  @column()
  public secondary_email : string

  @column()
  public notes : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
