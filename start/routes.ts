/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get('/test', async () => {return 'working'} )

Route.get('/company', 'CompanyContactsController.show').middleware('auth')

Route.group(() => {
  Route.get('/company_contacts', 'CompanyContactsController.index')
  Route.post('/company_contacts', 'CompanyContactsController.store')
  Route.get('/company_contacts/:id/edit', 'CompanyContactsController.edit')
  Route.patch('/company_contacts/:id', 'CompanyContactsController.update')
  Route.get('/company_contacts/:id/delete', 'CompanyContactsController.destroy')
}).middleware('isAdmin')

Route.get('/dashboard', 'DashboardController.index')

/*
Route.get('/dashboard', async ({view})  => {
  return view.render('admin')
})

 */

Route.get('/register', 'AuthController.showRegister').middleware('isAdmin')
Route.post('/register', 'AuthController.register').middleware('isAdmin')
Route.get('/register/:id/edit', 'AuthController.edit').middleware('editAdmin')
Route.patch('/register/:id', 'AuthController.update').middleware('editAdmin')

Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware('auth')

Route.group(()=> {
  Route.get('/client', 'ClientsController.index').middleware('isAdmin')
  Route.post('/client', 'ClientsController.store')
  Route.get('/client/:id/edit', 'ClientsController.edit')
  Route.patch('/client/:id', 'ClientsController.update')
}).middleware('auth')

Route.group(()=> {
  Route.get('/client_contact', 'ClientContactsController.index').middleware('isAdmin')
  Route.post('/client_contact', 'ClientContactsController.store')
  Route.get('/client_contact/:id/edit', 'ClientContactsController.edit')
  Route.patch('/client_contact/:id', 'ClientContactsController.update')
}).middleware('auth')

Route.group(() => {
  Route.get('/custodian', 'CustodiansController.index')
  Route.post('/custodian', 'CustodiansController.store')
  Route.get('/custodian/:id/edit', 'CustodiansController.edit')
  Route.patch('/custodian/:id', 'CustodiansController.update')
}).middleware('editAdmin')

Route.group( ()=>{
  Route.get('/distributor', 'DistributorsController.index')
  Route.post('/distributor', 'DistributorsController.store')
  Route.get('/distributor/:id/edit', 'DistributorsController.edit')
  Route.patch('/distributor/:id', 'DistributorsController.update')
}).middleware('editAdmin')

Route.group(() => {
Route.get('/funds', 'FundsController.index')
Route.post('/funds', 'FundsController.store')
Route.get('/funds/:id/edit', 'FundsController.edit')
Route.patch('/funds/:id', 'FundsController.update')
}).middleware('editAdmin')

Route.group(() => {
  Route.get('/pipeline', 'FundsPipelinesController.index')
  Route.post('/pipeline', 'FundsPipelinesController.store')
  Route.get('/pipeline/:id/edit', 'FundsPipelinesController.edit')
  Route.patch('/pipeline/:id', 'FundsPipelinesController.update')
}).middleware('editAdmin')

Route.group(() => {
  Route.get('/tasks', 'TasksController.index')
  Route.post('/tasks', 'TasksController.create')
  Route.get('/tasks/:id/edit', 'TasksController.edit')
  Route.patch('tasks/:id', 'TasksController.update')
}).middleware('isAdmin')

Route.group(() => {
  Route.get('/sub_tasks', 'SubTasksController.index')
  Route.post('/sub_tasks', 'SubTasksController.store')
  Route.get('/sub_tasks/:id/edit', 'SubTasksController.edit')
  Route.patch('sub_tasks/:id', 'SubTasksController.update')
}).middleware('isAdmin')

Route.group(() => {
  Route.get('/fund_documents/:fund_id', 'FundDocumentsController.index')
  Route.post('/fund_documents', 'FundDocumentsController.store')
  Route.get('/fund_documents/:id/edit', 'FundDocumentsController.edit')
  Route.patch('/fund_documents/:id', 'FundDocumentsController.update')
  Route.get('/fund_documents/:id/delete', 'FundDocumentsController.destroy')
}).middleware('editAdmin')


Route.get('/admin_funds', 'FundsController.show').middleware('isAdmin')
Route.get('/admin_clients', 'ClientsController.show').middleware('isAdmin')
Route.get('/client_details/:client_id', 'ClientsController.details').middleware('isAdmin')
Route.get('/client_contacts/:client_id', 'ClientContactsController.index').middleware('isAdmin')
Route.get('/your_tasks', 'TasksController.show').middleware('isAdmin')
Route.get('/fund_pipeline/:status', 'FundsPipelinesController.show').middleware('isAdmin')
Route.get('/task_sub_tasks/:task_id', 'SubTasksController.show').middleware('isAdmin')
Route.get('/add_sub_tasks/:task_id', 'SubTasksController.add_subtask_to_task').middleware('isAdmin')
Route.get('/fund_pipeline_details/:id', 'FundsPipelinesController.details').middleware('isAdmin')

