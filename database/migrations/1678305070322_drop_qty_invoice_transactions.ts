import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropQtyInvoiceTransactions extends BaseSchema {
  protected tableName = 'invoice_transactions'

  public async up () {
   await this.schema.table(this.tableName, (table) => {
      table.dropColumn('qty')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
