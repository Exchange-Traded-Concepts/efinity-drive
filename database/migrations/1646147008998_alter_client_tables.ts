import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterClientTables extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('client_type_id')
        .unsigned()
        .references('client_types.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.dropColumn('etf_website')
      table.dropColumn('primary_contact_name')
      table.dropColumn('primary_contact_phone')
      table.dropColumn('primary_contact_email')
      table.dropColumn('primary_contact_role')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
