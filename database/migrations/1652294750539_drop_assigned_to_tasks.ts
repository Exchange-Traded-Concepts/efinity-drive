import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropAssignedToTasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('assigned_to')
      table.dropColumn('assigned_to')

   })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
