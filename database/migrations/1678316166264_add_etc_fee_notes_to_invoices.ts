import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddEtcFeeNotesToInvoices extends BaseSchema {
  protected tableName = 'invoices'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('etc_fee', 14,2)
      table.text('notes')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
