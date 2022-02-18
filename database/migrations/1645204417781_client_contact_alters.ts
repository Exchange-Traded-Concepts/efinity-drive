import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClientContactAlters extends BaseSchema {
  protected tableName = 'client_contacts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('name')
      table.string('first_name')
      table.string('last_name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
