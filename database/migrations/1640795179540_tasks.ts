import BaseSchema from '@ioc:Adonis/Lucid/Schema'


export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.string('description')
      table.integer('assigned_to')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.integer('fund_id')
        .unsigned()
        .references('funds.id')
        .onDelete('CASCADE')
      table.integer('created_by')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.timestamp('target_completion_date', {useTz: true})
      table.boolean('completed').defaultTo(0)
      table.timestamp('completion_date' , {useTz:true})

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
