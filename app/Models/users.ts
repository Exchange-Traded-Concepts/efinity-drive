import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {column, beforeSave, BaseModel, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Group from "App/Models/Group";

export default class users extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public is_active: boolean

  @column()
  public is_admin: boolean

  @column()
  public can_edit: boolean

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(()=> Group,{
    pivotTable: 'user_groups',
    pivotColumns: ['user_id', 'group_id'],
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'group_id',
    localKey: 'id',
    relatedKey: 'id'
  })
  public groups: ManyToMany<typeof Group>

  @beforeSave()
  public static async hashPassword (users: users) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }
}
