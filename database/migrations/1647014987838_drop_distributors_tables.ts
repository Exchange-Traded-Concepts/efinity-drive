import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropDistributorsTables extends BaseSchema {
  protected tableName = 'distributors'

  public async up () {

    await this.down()

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
