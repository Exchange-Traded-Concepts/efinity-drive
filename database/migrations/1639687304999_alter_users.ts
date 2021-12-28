import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.boolean('is_admin').defaultTo(0)
      table.boolean('is_active').defaultTo(0)
      table.string('remember_me_token').nullable()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
