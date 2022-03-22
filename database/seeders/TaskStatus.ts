import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TaskStatus from "App/Models/TaskStatus";

export default class TaskStatusSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await TaskStatus.createMany([
      {
        rank: 1,
        name: 'No Progress',
        color : '#AEBACC',
      },
      {
        rank: 2,
        name: 'In Progress',
        color : '#E6B41D',
      },
      {
        rank: 3,
        name: 'Completed',
        color : '#27AE60',
      },
      {
        rank: 4,
        name: 'Archive',
        color : '#D52B1E'
      }])
  }
}
