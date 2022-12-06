import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notes extends BaseSchema {
  protected tableName = 'notes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('note_type_id')
        .unsigned()
        .references('note_types.id')
        .onDelete('CASCADE')
      table.integer('resource_id')
      table
        .integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('text')

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
