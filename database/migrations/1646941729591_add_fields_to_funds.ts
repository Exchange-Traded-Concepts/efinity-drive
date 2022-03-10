import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Funds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.integer('fiscal_year_end').nullable().alter()
      table.string('cusip').nullable()
      table.string('admin').nullable()
      table.float('management_fee').nullable()
      table.string('proxy').nullable()
      table.float('exp_ratio').nullable()

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('fiscal_year_end')
    })
  }
}
