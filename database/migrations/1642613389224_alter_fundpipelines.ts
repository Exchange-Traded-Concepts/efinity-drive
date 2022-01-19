import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterFundpipelines extends BaseSchema {
  protected tableName = 'fund_pipelines'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('sub_advisor_agreement')
      table.dateTime('target_launch_date')
      table
        .integer('trust_id')
        .unsigned()
        .references('trusts.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.dateTime('fifteenc_approval')
      table.string('four_ninety_five_status')
      table.dateTime('four_ninety_five_effective_date')
      table.string('role')
      table.dateTime('code_of_ethics_complete')
      })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
