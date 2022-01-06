import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlertClients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.string('city')
      table.string('state')
      table.string('zip')
      table.string('country')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
