import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DropPipelines extends BaseSchema {
  protected tableName = 'fund_pipelines'

  public async up () {
    await this.down()
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
