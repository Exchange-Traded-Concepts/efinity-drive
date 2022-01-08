import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Fund from "App/Models/Fund";


export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public zip: string

  @column()
  public country: string

  @column()
  public phone: string

  @column()
  public logo_file: string

  @column()
  public primary_contact_name: string

  @column()
  public primary_contact_phone: string

  @column()
  public primary_contact_email: string

  @column()
  public website: string

  @column()
  public etf_website: string

  @hasMany( () => Fund)
  public funds: HasMany<typeof Fund >

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
