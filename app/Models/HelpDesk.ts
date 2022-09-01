import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Group from "App/Models/Group";
import users from "App/Models/users";
import HelpDeskComment from "App/Models/HelpDeskComment";

export default class HelpDesk extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subject: string

  @column()
  public issue: string

  @column()
  public priority: string

  @column()
  public created_by: number
  @belongsTo(()=> users, {
    foreignKey: 'created_by',
    localKey: 'id'
  })
  public createdBy : BelongsTo<typeof users>

  @hasMany( () => HelpDeskComment)
  public helpdeskcomment: HasMany<typeof HelpDeskComment >

  @column()
  public groups_id: number
  @belongsTo(()=> Group)
  public groupsId : BelongsTo<typeof Group>

  @column()
  public doc: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
