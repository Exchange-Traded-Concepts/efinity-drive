import { DateTime } from 'luxon'
import { BaseModel,
         column,
          belongsTo,
          BelongsTo,} from '@ioc:Adonis/Lucid/Orm'
import Client from "App/Models/Client";
import Custodian from "App/Models/Custodian";
import Distributor from "App/Models/Distributor";

export default class Fund extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number
  @belongsTo(()=> Client)
  public client : BelongsTo<typeof Client>

  @column()
  public custodianId: number
  @belongsTo(() => Custodian)
  public custodian : BelongsTo<typeof Custodian>

  @column()
  public distributorId: number
  @belongsTo(()=> Distributor)
  public distributor: BelongsTo<typeof Distributor>

  @column()
  public ticker: string

  @column()
  public trust: string

  @column()
  public fiscal_year_end: string

  @column()
  public dividend_frequency: string

  @column()
  public fund_website: string

  @column()
  public exchange: string

  @column()
  public prospectus_date: DateTime

  @column()
  public fund_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
