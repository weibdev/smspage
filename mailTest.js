"use strict";
const nodemailer = require("nodemailer");
const { sendMoreOneMail } = require("./db");

const testMail = async(mail, pass) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: mail,
      pass: pass
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Contato ryco" <${mail}>`,
      to: ["rycotrampos@gmail.com"], 
      subject: "Verificação de email", // Subject line
      text: "Esse email esta sendo adicionado", // plain text body
    })
    return true
  }catch{
    return false
  }
}

const sendMail = async (mail, msg, id, mailS, passS) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: mailS,
      pass: passS
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Contato" <${mailS}` ,
      to: mail, 
      subject: "no-reply",
      text: msg,
    })
    return sendMoreOneMail(id, false)
  }catch{
    return sendMoreOneMail(id, true)
  }
}

const testMessage = async (msg) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: 'rycotrampos@hotmail.com',
      pass: 'ryco7777'
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Contato" <rycotrampos@hotmail.com` ,
      to: 'rycotrampos@gmail.com', 
      subject: "no-reply",
      text: msg,
    })
    return {error: false, msg: "Mensagem de teste enviada com sucesso!"} 
  }catch{
    return {error: true, msg: "Erro: ouve um erro ao testar a mensagem!"}
  }
}

module.exports = {
  testMail,
  sendMail,
  testMessage
}