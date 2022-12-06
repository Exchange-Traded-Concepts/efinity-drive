import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import NoteType from "App/Models/NoteType";
import users from "App/Models/users";

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public note_type_id: number
  @belongsTo(()=> NoteType, {
    foreignKey: 'note_type_id',
    localKey: 'id'
  })
  public noteTypeId : BelongsTo<typeof NoteType>

  @column()
  public resource_id: number

  @column()
  public text: string

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
