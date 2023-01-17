import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FundsLeis extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('lei_renewal_date')
      table.string('lei')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
