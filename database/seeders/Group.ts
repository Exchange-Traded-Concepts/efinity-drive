import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Group from "App/Models/Group";

export default class GroupSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
   await Group
      .createMany([
        {
          id: 1,
          name: 'IT',
          rank: 10,
        },
        {
          id: 2,
          name: 'Compliance',
          rank: 20,
        },
        {
          id: 3,
          name: 'Marketing',
          rank: 30,
        },
        {
          id: 4,
          name: 'Sales',
          rank: 40,
        },
        {
          id: 5,
          name: 'Legal',
          rank: 50,
        },
        {
          id: 6,
          name: 'Operations',
          rank: 60,
        },
        {
          id: 7,
          name: 'Management',
          rank: 70,
        },
        {
          id: 8,
          name: 'Accounting',
          rank: 80,
        },
        {
          id: 9,
          name: 'Portfolio Management',
          rank: 90,
        },
      ])
  }
}
