import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FundsAddSeeds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('seed_date')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
