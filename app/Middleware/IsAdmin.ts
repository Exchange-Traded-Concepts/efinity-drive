import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsAdmin {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    // @ts-ignore
    if (auth.isLoggedIn && (auth.user.is_admin === 1)) {
      await next()
    } else {
      return response.redirect('/')
    }
  }
}
