import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DocType from "App/Models/DocType";

export default class DocTypeSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await DocType.createMany([
      {
        name: 'Client'
      },
      {
        name: 'Fund'
      },
      {
        name: 'Task'
      },
      {
        name: 'SubTask'
      }

    ])
  }
}
