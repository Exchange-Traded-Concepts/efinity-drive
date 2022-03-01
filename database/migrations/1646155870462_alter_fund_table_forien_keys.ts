import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterFundTableForienKeys extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('custodian_id')
      table.dropForeign('distributor_id')
      table.dropColumn('custodian_id')
      table.dropColumn('distributor_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
