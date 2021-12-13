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


Route.get('/custodian', 'CustodiansController.index')

Route.get('/distributor', 'DistributorsController.index')
Route.post('/distributor', 'DistributorsController.store')
Route.get('/distributor/:id/edit', 'DistributorsController.edit')
Route.patch('/distributor/:id', 'DistributorsController.update')
