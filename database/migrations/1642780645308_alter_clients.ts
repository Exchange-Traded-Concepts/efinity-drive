import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterClients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('primary_contact_role')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
