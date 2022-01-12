import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubTaskAlters extends BaseSchema {
  protected tableName = 'sub_tasks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('completion_date')
      table.string('document_name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
