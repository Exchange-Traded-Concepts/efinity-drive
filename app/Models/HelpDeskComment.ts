import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";
import HelpDesk from "App/Models/HelpDesk";

export default class HelpDeskComment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public comment: string

  @column()
  public created_by: number
  @belongsTo(()=> users, {
    foreignKey: 'created_by',
    localKey: 'id'
  })
  public createdBy : BelongsTo<typeof users>

  @column()
  public helpDeskId: number
  @belongsTo(()=> HelpDesk, {
    foreignKey: 'help_desk_id',
    localKey: 'id'
  })
  public help_desk_id : BelongsTo<typeof HelpDesk>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
