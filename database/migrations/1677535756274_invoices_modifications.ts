import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoicesModifications extends BaseSchema {
  protected tableName = 'invoices'

  public async up () {
    this.schema.alterTable(this.tableName,(table) => {
      table.decimal('month_end_assets', 14, 2)
      table.decimal('avg_daily_assets', 14, 2)
      table.decimal('income', 14, 2)
      table.string('bps')
      table.integer('days_in_year')
      table.string('pdf_url')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
