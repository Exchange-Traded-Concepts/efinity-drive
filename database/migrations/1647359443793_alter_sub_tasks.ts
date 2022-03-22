import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubTasks extends BaseSchema {
  protected tableName = 'sub_tasks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('task_statuses_id')
        .unsigned()
        .references('task_statuses.id')
        .onDelete('CASCADE') // delete profile when user is deleted
    })
  }

  public async down () {
    //@ts-ignore
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
