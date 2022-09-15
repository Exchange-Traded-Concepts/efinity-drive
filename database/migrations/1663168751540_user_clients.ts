import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserClients extends BaseSchema {
  protected tableName = 'user_clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('client_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE') // delete profile when user is deleted

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
