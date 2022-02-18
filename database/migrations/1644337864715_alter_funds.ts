import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterFunds extends BaseSchema {
  protected tableName = 'funds'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.string('status')
      table.timestamp('client_questionnaire_sent')
      table.timestamp('client_questionnaire_completed')
      table.timestamp('client_sent_sample_portfolio_data')
      table.string('portfolio_notes')
      table.timestamp('proposal_sent')
      table.timestamp('license_sponsorship')
      table.timestamp('psa_form_sent')
      table.timestamp('psa_form_complete')
      table.timestamp('diligence_sent')
      table.timestamp('diligence_received')
      table.string('strategy')
      table.text('sec_comments')
      table.text('notes')
      table.timestamp('launch_date')
      table.dateTime('sub_advisor_agreement')
      table.dateTime('target_launch_date')
      table.dateTime('fifteenc_approval')
      table.string('four_eighty_five_status')
      table.dateTime('four_eighty_five_effective_date')
      table.string('role')
      table.dateTime('code_of_ethics_complete')
      table.dateTime('pea')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
