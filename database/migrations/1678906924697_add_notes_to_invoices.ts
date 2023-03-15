import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddNotesToInvoices extends BaseSchema {
  protected tableName = 'invoices'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('notes')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
