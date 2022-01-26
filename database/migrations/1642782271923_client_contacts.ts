import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClientContacts extends BaseSchema {
  protected tableName = 'client_contacts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('name')
      table.string('role')
      table.string('email')
      table.string('phone')
      table.string('secondary_email')
      table.text('notes')
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
