import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterTasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('assigned_to_group_id')
        .unsigned()
        .references('groups.id')
        .onDelete('CASCADE') // delete profile when user is deleted
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
