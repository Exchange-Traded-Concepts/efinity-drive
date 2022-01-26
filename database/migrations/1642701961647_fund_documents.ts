import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FundDocuments extends BaseSchema {
  protected tableName = 'fund_documents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('fund_id')
        .unsigned()
        .references('funds.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('name')
      table.string('url')
      table.string('size')
      table.string('type')
      table.integer('created_by')
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
