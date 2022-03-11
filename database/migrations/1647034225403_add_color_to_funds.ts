import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Funds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('color').nullable()
    })
  }

  public async down () {
    //@ts-ignore
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
