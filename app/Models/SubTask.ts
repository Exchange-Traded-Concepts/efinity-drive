import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import users from "App/Models/users";
import Task from "App/Models/Task";

export default class SubTask extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title : string

  @column()
  public description : string

  @column()
  public assigned_to : number
  @belongsTo(() => users , {
    foreignKey: 'assigned_to',
    localKey: 'id'
  })
  public assignedTo : BelongsTo<typeof users>

  @column()
  public created_by : string
  @belongsTo(()=> users, {
    foreignKey: 'created_by',
    localKey: 'id'
  })
  public createdBy: BelongsTo<typeof users>

  @column()
  public task_id: number
  @belongsTo(()=> Task, {
    foreignKey: 'task_id',
    localKey: 'id'
  })
  public taskId: BelongsTo<typeof Task>

  @column.dateTime()
  public target_completion_date : DateTime

  @column()
  public document_url: string

  @column()
  public notes: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
