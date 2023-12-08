const { json } = require("body-parser");
const express = require("express");
const { loginByUser, createMessage, getMessages, loginByToken, createMail, getMails, addEmail, removeEmail, getEmails } = require("./db");
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")
const sms = require('./sms')
const app = express()
const path = require("path")

const Email = require('./mailTest')

const storage = multer.diskStorage({
    destination: (req, file ,cb) => {
        cb(null, "uploads/")
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname)
    }
    
})

const upload = multer({storage})

app.use(cors())

app.post("/sendSms", upload.single("numbers"), async(req, res) => { 

    const {
        msg, 
        deley, 
        date,
        ddd
    } = req.body;


    numbers = fs.readFile(req.file.path,'utf-8', async (err, arq) => {
        const numbers = arq.split("\n")
        
        const numbersCount = numbers.length
        var numbersSend = 0

        const id = await createMessage(msg, numbersCount, deley, date)

        const interval = setInterval(() => {
            let num = ddd+numbers[numbersSend]

            sms.sendSMS(num, msg, id)
            
            numbersSend += 1
            if (numbersSend >= numbersCount) clearInterval(interval)
        },  deley)

    })

    res.send({msg: "SMS Enviado com sucesso!"})
})

app.post("/sendSmsTest", upload.single("numbers"), async(req, res) => {
    const {
        msg, 
    } = req.body;

    const message = await sms.sendSMSTest(msg)

    res.send({msg: message})
})


app.post("/sendMailTest", upload.single("numbers"), async(req, res) => {
    const {
        msg, 
    } = req.body;

    const message = await Email.testMessage(msg)

    res.send(message)
})



app.post("/sendMail", upload.single("numbers"), async(req, res) => { 

    const {
        msg, 
        deley, 
        date,
    } = req.body;


    mails = fs.readFile(req.file.path,'utf-8', async (err, arq) => {
        
        const mail = arq.split("\n")
        const mailCount = mail.length
        
        const mailsSender = await getEmails();
        const mailsSenderCount = mailsSender.length

        if(mailsSenderCount < 1) return res.send({msg: "ERRO: Nenhum email cadastrado para enviar mensagem!"})

        var mailSend = 0
        var mailSender = 0

        const id = await createMail(msg, mailCount, deley, date)

        const interval = setInterval(() => {

            let m = mail[mailSend]
            let mailS = mailsSender[mailSender]

            Email.sendMail(m, msg, id, mailS.mail, mailS.pass)

            mailSend += 1
            mailSender += 1

            if(mailSender >= mailsSenderCount) mailSender = 0

            if (mailSend >= mailCount) clearInterval(interval)
        },  deley)

        res.send({msg: "Emails Enviado com sucesso!"})
    })

})

app.post("/loginByUser",json(), async (req, res) => {
    const {user, pass} = req.body;

    const response = await loginByUser(user, pass)

    res.send(response)
})

app.post("/loginByToken", json(), async (req, res) => {
    const {token} = req.body;

    const response = await loginByToken(token)

    res.send(response)
})

app.post("/hisSms", async (req, res) => {
    const response = await getMessages()

    res.send(response)
})

app.post("/hisMail", async (req, res) => {
    const response = await getMails()

    res.send(response)
})

// emails config

app.post("/addEmail",json() , async (req, res) => {
    const {mail, pass} = req.body

    const mailIsVal = await Email.testMail(mail, pass)

    if(mailIsVal) {
        const response = await addEmail(mail, pass)
        res.send({error:false, msg: "Email Adicionado com sucesso!"})
    } else {
        res.send({error: true, msg: "Email e/ou Senha Invalido"})
    }

    
})

app.post("/removeEmail",json() , async (req, res) => {
    const {mail} = req.body

    const response = await removeEmail(mail)

    res.send(response)
})

app.post("/getEmail", async (req, res) => {
    const response = await getEmails()

    res.send(response)
})

// end emails config


app.use(express.static(path.join(__dirname, "build")))


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
    // res.sendFile(path.join(__dirname, "build", "index.html"));

})

app.listen("3000", () => {
    console.log("Server on PORT: 3000");
})
