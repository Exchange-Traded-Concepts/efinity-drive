import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from "App/Models/Client";

export default class ClientAuth {
  public async handle({auth, response, session}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    // Declare two array
      const array1= session.get('user_clients');
      const array2= await Client.query().select('id')

    // Iterate through each element in the
    // first array and if some of them
    // include the elements in the second
    // array then return true.
    // @ts-ignore
    if(array1.some(item => array2.includes(item)) &&  (auth.isLoggedIn && auth.user.is_active)){
          await next()
    }
    else {
      return response.redirect('/')
    }
  }
}
