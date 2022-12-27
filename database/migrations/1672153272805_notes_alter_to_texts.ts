import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class NotesAlterToTexts extends BaseSchema {
  protected tableName = 'notes'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('text').notNullable().alter()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
       **/
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
