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

Route.get('/company_contacts', 'CompanyContactsController.index')
Route.post('/company_contacts', 'CompanyContactsController.store')

Route.get('/dashboard', async ({view})  => {
  return view.render('admin')
})

Route.get('/client', 'ClientsController.index')
Route.post('/client', 'ClientsController.store')
Route.get('/client/:id/edit', 'ClientsController.edit')
Route.patch('/client/:id', 'ClientsController.update')

Route.get('/custodian', 'CustodiansController.index')
Route.post('/custodian', 'CustodiansController.store')
Route.get('/custodian/:id/edit', 'CustodiansController.edit')
Route.patch('/custodian/:id', 'CustodiansController.update')

Route.get('/distributor', 'DistributorsController.index')
Route.post('/distributor', 'DistributorsController.store')
Route.get('/distributor/:id/edit', 'DistributorsController.edit')
Route.patch('/distributor/:id', 'DistributorsController.update')

Route.get('/funds', 'FundsController.index')
Route.post('/funds', 'FundsController.store')
Route.get('/funds/:id/edit', 'FundsController.edit')
Route.patch('/funds/:id', 'FundsController.update')
