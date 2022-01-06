import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FundPiplines extends BaseSchema {
  protected tableName = 'fund_pipelines'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('fund_id')
        .unsigned()
        .references('funds.id')
        .onDelete('CASCADE') // delete profile when user is deleted
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

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
