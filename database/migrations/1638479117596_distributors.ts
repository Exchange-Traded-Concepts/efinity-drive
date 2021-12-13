import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Distributors extends BaseSchema {
  protected tableName = 'distributors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('address')
      table.string('city')
      table.string('state')
      table.string('zip')

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
