import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterFundsAddColumns extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('custodian_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table
        .integer('distributor_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE') // delete profile when user is deleted

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
