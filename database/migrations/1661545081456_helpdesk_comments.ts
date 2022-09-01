import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HelpdeskComments extends BaseSchema {
  protected tableName = 'help_desk_comments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('comment')
      table
        .integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('help_desk_id')
        .unsigned()
        .references('help_desks.id')
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
