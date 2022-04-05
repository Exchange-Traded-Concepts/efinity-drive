import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropFundDocs extends BaseSchema {
  protected tableName = 'fund_documents'

  public async up () {
    await this.down()
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
