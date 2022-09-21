import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ClientType from "App/Models/ClientType";

export default class ClientTypeSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await ClientType
      .createMany([
        {
          id: 1,
          name: 'client',
         },
        {
          id: 2,
          name: 'distributor',
        },
        {
          id: 3,
          name: 'custodian',
        },
        {
          id: 4,
          name: 'vendor',
        },
      ])
  }
}
