import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import NoteTypes from "App/Models/NoteType";

export default class NoteSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await NoteTypes.createMany([
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
      },
  ])
  }
}
