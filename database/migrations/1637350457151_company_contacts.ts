import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CompanyContacts extends BaseSchema {
  protected tableName = 'company_contacts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name')
      table.string('last_name')
      table.string('email')
      table.string('office_phone')
      table.string('other_phone')
      table.string('office_location')
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
