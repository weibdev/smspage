const { Vonage } = require('@vonage/server-sdk');
const { sendMoreOneMessage, sendMoreOneMail } = require('./db');

const vonage = new Vonage({
  apiKey: "81688846",
  apiSecret: "f3IHwL5gqujw4Fa3"
})

const from = "Vonage APIs"
const numTest = 5511981551940

async function sendSMS(to, text, id) {
    var err = false

    await vonage.sms.send({to, from, text})
      .then(r => { err = false })
      .catch(r => { err = true });
        
    if(err) console.log('erro ao enviar mensagem para o ' + to);
    else console.log('Mensagem enviada para o ' + to);

    sendMoreOneMessage(id, err)
}

async function sendSMSTest(text) {
  var err = false

  await vonage.sms.send({numTest, from, text})
    .then(r => { err = false })
    .catch(r => { err = true });
      
  if(err) return('erro ao testar mensagem');
  else return('Mensagem de teste enviada');
}

async function sendMail(to, text, id) {
  var err = true

  // if(err) console.log('erro ao enviar mensagem para o ' + to);
  // else console.log('Mensagem enviada para o ' + to);

  sendMoreOneMail(id, err)
}


module.exports = {
    sendSMS,
    sendMail,
    sendSMSTest
}