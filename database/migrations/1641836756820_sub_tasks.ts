import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubTasks extends BaseSchema {
  protected tableName = 'sub_tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.text('description')
      table.integer('assigned_to')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.integer('task_id')
        .unsigned()
        .references('tasks.id')
        .onDelete('CASCADE')
      table.dateTime('target_completion_date')
      table.string('document_url')
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
