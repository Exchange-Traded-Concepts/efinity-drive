import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceTransactions extends BaseSchema {
  protected tableName = 'invoice_transactions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('invoice_id')
        .unsigned()
        .references('invoices.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('type')
      table.text('description')
      table.integer('qty')
      table.decimal('min_payment', 14,2)
      table.decimal('calc_payment', 14,2)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
