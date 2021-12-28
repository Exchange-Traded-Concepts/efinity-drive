import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterUserAddEdits extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('can_edit').defaultTo(0)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
