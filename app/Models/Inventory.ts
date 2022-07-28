import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import CompanyContacts from "App/Models/CompanyContact"


export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public serial: string

  @column()
  public type: string

  @column()
  public assigned_to: number
  @belongsTo(()=> CompanyContacts, {
    foreignKey: 'assigned_to',
    localKey: 'id'
  })
  public assignedTo : BelongsTo<typeof CompanyContacts>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
