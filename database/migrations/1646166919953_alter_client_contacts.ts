import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterClientContacts extends BaseSchema {
  protected tableName = 'client_contacts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('secondary_email')
      table.string('secondary_phone')


    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
