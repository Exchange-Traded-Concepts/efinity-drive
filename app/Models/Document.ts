import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";
import DocType from "App/Models/DocType";

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public doc_type_id: number
  @belongsTo(()=> DocType, {
    foreignKey: 'doc_type_id',
    localKey: 'id'
  })
  public docTypeId : BelongsTo<typeof DocType>

  @column()
  public resource_id: number

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
