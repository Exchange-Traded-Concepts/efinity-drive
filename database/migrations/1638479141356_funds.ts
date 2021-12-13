import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Funds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('custodian_id')
        .unsigned()
        .references('custodians.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('distributor_id')
        .unsigned()
        .references('distributors.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('ticker')
      table.string('trust')
      table.string('fiscal_year_end')
      table.string('dividend_frequency')
      table.string('fund_website')
      table.string('exchange')
      table.timestamp('prospectus_date')
      table.string('fund_name')
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
