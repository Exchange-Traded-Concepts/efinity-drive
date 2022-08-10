import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CalenderEvents extends BaseSchema {
  protected tableName = 'calendar_events'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.dateTime('start_date')
      table.dateTime('end_date')
      table.integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.string('notes')
      table.string('type')
      table.boolean('public')
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
