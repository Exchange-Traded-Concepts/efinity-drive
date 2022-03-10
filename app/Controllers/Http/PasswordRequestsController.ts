import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import users from "App/Models/users";
import PasswordResetToken from "App/Models/PasswordResetToken";
import { string } from '@ioc:Adonis/Core/Helpers'
import Encryption from '@ioc:Adonis/Core/Encryption';
import Mail from "@ioc:Adonis/Addons/Mail";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Env from "@ioc:Adonis/Core/Env";



export default class PasswordRequestsController {
  public async index({}: HttpContextContract) {}

  public async create({view}: HttpContextContract) {
    return view.render('auth/forgot-password', {})

  }

  public async store({request, session, response}: HttpContextContract) {

    //@ts-ignore

    const email = await request.input('email')

    const user = await users.findByOrFail('email', email)

    await PasswordResetToken.query().where('users_id', user.id).delete()

    const { token } = await PasswordResetToken.create({
      usersId : user.id,
      token: Encryption.encrypt(string.generateRandom(32),'30 minutes')
    })

    //await Event.emit('passwordResetRequested', {user, token})

    const base_url = Env.get('URL')

    console.log(base_url)

    await Mail.sendLater((message) => {
      message
        .from('info@etcdev.com')
        .to(user.email)
        .subject('Password Reset for Efinity')
        .htmlView('emails/password-reset', { name: user.first_name+' '+user.last_name , token : token, base_url })
    })

    session.flash({ alert:  {type: 'success', message: 'A password reset link has been sent' },})

    return response.redirect().back()

  }

  public async show({}: HttpContextContract) {}

  public async edit({params, view, session, response}: HttpContextContract) {

    try{
     const token = await PasswordResetToken.query()
       .where('token', decodeURIComponent(params.token))
       .preload('user')
       .firstOrFail()

      return view.render('auth/reset-password', {token: token.token, email:token.user.email})

    } catch (e) {
       session.flash({
        alert: { type: 'error', message: 'Invalid Token'}
      })
      return response.redirect('/')
    }


  }

  public async update({request, session, response}: HttpContextContract) {

    try {

      const payload = await this.validateInput(request)
      const token = await PasswordResetToken.query()
        .where('token', payload.token)
        .preload('user')
        .firstOrFail()

      const user = token.user
      user.password = payload.password

      await user.save()

      await token.delete()

      session.flash({
        alert: {
          type: 'success',
          message: 'Password Reset'
        }
      })

      return response.redirect('/')
    } catch (e) {
      session.flash({
        alert: {
          type: 'error',
          message: 'Invalid Password Reset Token'
        }
      })
    }

  }

  public async destroy({}: HttpContextContract) {}


  private async validateInput(request) {
    const valSchema = schema.create({
      token: schema.string(),
      email: schema.string({}, [rules.email(), rules.exists({table: 'users', column: 'email'})]),
      password: schema.string({trim:true}, [rules.maxLength(150)])
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'email.email': 'Not a valid email',
        'email.exists': 'Email Not Associsted With A User',
        'password.maxlength': 'Password exceeds requirements'
      },
    })

  }

    }

