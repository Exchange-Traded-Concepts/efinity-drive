import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Helpdesks extends BaseSchema {
  protected tableName = 'help_desks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('groups_id')
        .unsigned()
        .references('groups.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('subject')
      table.string('issue')
      table.string('priority')
      table.string('doc')
      table.string('status')
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
