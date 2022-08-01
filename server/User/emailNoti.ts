import nodemailer from "nodemailer";
import dotenv from "dotenv";
import moment from "moment";

export async function sendEMail(status: string, email: string) {
  // console.log(process.env.ACCESSTOKEN);

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.ACCOUNT,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
      },
    });
  
    // send mail with defined transport object
    let date = moment().format("L");
    let time = moment().format("LTS");
    if (status == "login") {
      // console.log('entered login...');
      console.log("EMAIL TO SENT",email);
      
      let info = await transporter.sendMail({
        from: "FRESHAIR 登入通知 <freshair202207@gmail.com>", // sender address
        to: email, // list of receivers
        subject: `你的 FRESHAIR 帳戶有登入活動`, // Subject line
        // text: `Your Freshair account has been logged in at ${ms}`, // plain text body
        html: `<b>你的 FRESHAIR 帳戶有登入活動<br>
          登入時間：${date}&nbsp;${time}.</br>`, // html body
      });
  
      console.log("Message sent: %s", info.accepted);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  
    if (status == "register") {
      let info = await transporter.sendMail({
        from: "FRESHAIR 註冊通知 <freshair202207@gmail.com>", // sender address
        to: email, // list of receivers
        subject: `你已成功註冊 FRESHAIR 帳戶！`, // Subject line
        // text: `Your Freshair account has been logged in at ${ms}`, // plain text body
        html: `<b>感謝您的支持！你已成功註冊FRESHAIR帳戶！<br>
          請即登入以享受FRESHAIR髮型師配對服務，輕鬆剪髮！
            </b>`, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  
  
    if (status == "newBooking") {
      let info = await transporter.sendMail({
        from: "FRESHAIR 新增預約通知 <freshair202207@gmail.com>", // sender address
        to: email, // list of receivers
        subject: `你收到新的 FRESHAIR 預約！`, // Subject line
        // text: `Your Freshair account has been logged in at ${ms}`, // plain text body
        html: `<b>你收到一個新嘅預約！<br>
          快啲登入 FRESHAIR 睇睇預約詳情！
            </b>`, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  
  
    if (status == "acceptBooking") {
      console.log("SENDING CONFIRM EMAIL................................................................",email,typeof email);
  
      let info = await transporter.sendMail({
        
        
        from: "FRESHAIR 確認預約通知 <freshair202207@gmail.com>", // sender address
        to: email, // list of receivers
        subject: `你的 FRESHAIR 預約已確認！`, // Subject line
        // text: `Your Freshair account has been logged in at ${ms}`, // plain text body
        html: `<b>你的 FRESHAIR 預約已確認！<br>
          快啲登入 FRESHAIR 睇睇預約詳情！
            </b>`, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  
  
    if (status == "rejectBooking") {
      console.log("SENDING REJECT EMAIL................................................................",email,typeof email);
  
      let info = await transporter.sendMail({
        
        
        from: "FRESHAIR 預約失敗通知 <freshair202207@gmail.com>", // sender address
        to: email, // list of receivers
        subject: `你的 FRESHAIR 預約不成功！`, // Subject line
        // text: `Your Freshair account has been logged in at ${ms}`, // plain text body
        html: `<b>你的 FRESHAIR 預約不成功！<br>
          快啲登入 FRESHAIR 睇睇預約詳情！
            </b>`, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  } catch (error) {
    console.log(error)
    return
  }
  // create reusable transporter object using the default SMTP transport
  
}
