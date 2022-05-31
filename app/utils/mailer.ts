import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";


export default class EFMailer{

  static async email(to_address, subject, template, data){
    await Mail.sendLater((message) => {
      message
        .from('info@etc-efinity.com')
        .to(to_address)
        .subject(subject)
        .htmlView(template, data)
    })
  }

  static async getEmailByGroupArray(IDArray){
    try {
      const result = await Database.rawQuery('SELECT email FROM users as u JOIN user_groups as ug ON u.id = ug.user_id WHERE ug.group_id IN ( ? ) ' , [IDArray])
      let x = []
      //const result = await users.all()
     // console.log(result[0])
      let emails = result[0]
      for(let i = 0; i < emails.length; i++) {
      //  console.log(emails[i].email)
        // @ts-ignore
        x.push(emails[i].email)
        }
      //console.log(x)
      const mailto = x.toString()
      //console.log(mailto)
      return mailto
    }
    catch (err){
      console.log(err)
    }
  }
}

module.exports = EFMailer
