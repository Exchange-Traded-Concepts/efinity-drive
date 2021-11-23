import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterContacts extends BaseSchema {
  protected tableName = 'company_contacts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      //table.increments('id')

      table.string('job_title')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      //table.timestamp('created_at', { useTz: true })
      //table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
