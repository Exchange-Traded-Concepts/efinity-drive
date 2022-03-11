import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropCustodiansTables extends BaseSchema {
  protected tableName = 'custodians'

  public async up () {

    await this.down()

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
