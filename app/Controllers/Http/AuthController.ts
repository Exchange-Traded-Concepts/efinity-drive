import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {rules, schema} from "@ioc:Adonis/Core/Validator";
import users from "App/Models/users";
import Database from "@ioc:Adonis/Lucid/Database";


export default class AuthController {

  public async showRegister({view}: HttpContextContract) {
    const allUsers = await users.all()
    const maint = 'show'
    return view.render('auth/register', {allUsers, maint})

  }
  public async register({view, request, session, response}: HttpContextContract) {

    const p_worked = await this.confirmPassword(request.input('password') ,request.input('password_confirmation'))
    if(!p_worked){
      session.flash('notification', "Your passwords didnt match")
      return response.redirect('back', )
    }

    // Validate input
    const data = await this.validateInput(request)

    const user = await users.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      is_active: await this.trueCheck(request.input('is_active')),
      is_admin: await this.trueCheck(request.input('is_admin')),
      can_edit: await this.trueCheck(request.input('can_edit'))
    })

    session.put('created_user',{ user })
    console.log(session.get('created_user.user.first_name'))

    const allUsers = await users.all()
    const maint = 'show'

    return view.render('auth/register', {allUsers, maint})

  }

  public async login({ request, auth, session, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      let x = []
      const cur_user  =  await auth.attempt(email, password)
      // @ts-ignore
      const user_groups = await Database.rawQuery('SELECT group_id FROM user_groups where user_id =? ', [auth.user.id])

      console.log(user_groups[0])

      for (let i = 0; i < user_groups[0].length; i++) {
        console.log('start loop ' + i)
        console.log('loop is '+ user_groups[0].length + ' long')
        console.log('ID V')
        console.log(user_groups[0][i])
        console.log(user_groups[0][i].group_id)
        // @ts-ignore
        x.push( user_groups[0][i].group_id )
      }
      console.log('outside of loop')
      console.log(x)
      console.log('x should br that ^')

      if(x) session.put('user_groups', x)// cur_user.groups = user_groups

      session.put('cur_user', {cur_user})
      return response.redirect('/dashboard')
    } catch (error) {
      session.flash('notification', "We couldn't verify your credentials.")

      return response.redirect('back')
    }
  }

  public async logout({ auth, response, session }: HttpContextContract) {
    await auth.logout()
    session.clear()
    return response.redirect('/')
  }


  public async edit({view, params}:HttpContextContract){
    const cuser = await users.findOrFail(params.id)
    const allUsers = await users.all()
    const maint = 'show'

    return view.render('auth/register', {allUsers, maint, cuser})

  }

  public async update({params, request, session, view}:HttpContextContract){
    const u = await users.findOrFail( params.id)

    const data = await this.validateUpdate(request)

    if(u.email != request.input('email')){
      const emailScehma = schema.create({
        email: schema.string({trim: true}, [rules.maxLength(255)]),
      })
      return await request.validate({
      schema: emailScehma,
      messages: {
        'email.required': 'Name is required',
      }
    })
    }

    u.merge({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      is_active: await this.trueCheck(request.input('is_active')),
      is_admin: await this.trueCheck(request.input('is_admin')),
      can_edit: await this.trueCheck(request.input('can_edit'))
    })

    await u.save()
    session.flash('notification', 'User Updated')
    const allUsers = await users.all()
    const maint = 'show'

    return view.render('auth/register', {allUsers, maint})

  }

  private async validateInput(request) {
    const valSchema = schema.create({
      first_name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      last_name:  schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
      email: schema.string({trim: true}, [rules.maxLength(255),
        rules.email(),
        rules.unique( {table: 'users', column: 'email'})]),
      password: schema.string({trim:true}, [rules.maxLength(255)]),
    })

    return await request.validate({
      schema: valSchema,
      messages: {
        'first_name.required': 'Name is required',
        'last_name.required': 'Name allows upto 150 characters',
        'email.required': 'Valid email required',
      },
    })
  }

  private async validateUpdate(request) {
    if(!request.input('password')) {
      const valSchema = schema.create({
        first_name: schema.string({trim: true}, [rules.maxLength(150), rules.required()]),
        last_name: schema.string({trim: true}, [rules.maxLength(150), rules.required()]),
        email: schema.string({trim: true}, [rules.maxLength(255),
          rules.email(),
        ]),
      })

      return await request.validate({
        schema: valSchema,
        messages: {
          'first_name.required': 'Name is required',
          'last_name.required': 'Name allows upto 150 characters',
          'email.required': 'Valid email required',
        },
      })
    }
    else {
      const valSchema = schema.create({
        first_name: schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
        last_name:  schema.string({ trim: true }, [rules.maxLength(150), rules.required()]),
        email: schema.string({trim: true}, [rules.maxLength(255),
          rules.email()]),
         password: schema.string({trim:true}, [rules.maxLength(255)]),
      })

      return await request.validate({
        schema: valSchema,
        messages: {
          'first_name.required': 'Name is required',
          'last_name.required': 'Name allows upto 150 characters',
          'email.required': 'Valid email required',
        },
      })
    }
  }

  private async confirmPassword( password, confirm_passowrd){
    return password == confirm_passowrd;
    }

  private async trueCheck(var1){
    return var1 == 1;
  }


}

