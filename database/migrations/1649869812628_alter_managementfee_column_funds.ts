import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Funds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('management_fee').alter()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
