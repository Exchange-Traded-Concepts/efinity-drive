import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ClientAuth {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    // @ts-ignore
    if (auth.isLoggedIn && auth.user.can_edit) {
      await next()
    }
    else {
      return response.redirect('/')
    }
  }
}
