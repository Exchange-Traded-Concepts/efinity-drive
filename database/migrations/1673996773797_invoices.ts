import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Invoices extends BaseSchema {
  protected tableName = 'invoices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('fund_id')
        .unsigned()
        .references('funds.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.timestamp('invoice_date')
      table.timestamp('invoice_for_date')
      table.integer('days_in_month')
      table.string('invoice_number')
      table.float('expense_ratio')
      table.boolean('paid')
      table.string('attn')
      table
        .integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
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
