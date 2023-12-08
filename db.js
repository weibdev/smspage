const firebase = require('firebase');
const uniqid = require('uniqid');
const bcrypt = require('bcrypt');

const firebaseConfig = {
    apiKey: "AIzaSyBc-o1aYi0BU7eZkq1k8TnE-aC_mbzUefc",
    authDomain: "sms-page-e7996.firebaseapp.com",
    projectId: "sms-page-e7996",
    storageBucket: "sms-page-e7996.appspot.com",
    messagingSenderId: "246513448925",
    appId: "1:246513448925:web:ac88487aa189423c5be834",
    measurementId: "G-3XJJB0SN2J"
  };
  
  firebase.default.initializeApp(firebaseConfig);

const FS = firebase.default.firestore();

const loginByUser = async (user, pass) => {
  const userSnap = (await FS.collection("users").where("user", "==", user).get()).docs[0]

  if(!userSnap) return {error: true, message: "Usuario e/ou senha invalidos"};

  const userData = userSnap.data()

  const passIsCorrect = await bcrypt.compare(pass, userData.pass)

  if(!passIsCorrect) return {error: true, message: "Usuario e/ou senha invalidos"};

  return {error: false, token: userData.token}
}

const loginByToken = async (token) => {
  
  const userSnap = (await FS.collection("users").where("token", "==", token).get()).docs[0]
  
  if(!userSnap)  return {error: true}
  else return {error: false}
}

const createMessage = async (msg, numCount, deley, date) => {
  const id = uniqid()

  await FS.collection("messages").add({
    msg,
    id,
    date,
    numbers:{
      numCount,
      sends: 0,
      error: 0
    },
    deley,
    finish: false
  })

  return id
}

const sendMoreOneMessage = async (id, err) => {
  const snapshot = await (await FS.collection("messages").where("id", "==", id).get()).docs[0]

  const data = await snapshot.data().numbers

  if(data.sends + 1 >= data.numCount){
    FS.collection("messages").doc(snapshot.id).update({
      numbers:{
        numCount: data.numCount,
        sends: data.sends + 1,
        error: err ? data.error + 1 : data.error 
      },
      finish: true
    })
    
  }else {
    FS.collection("messages").doc(snapshot.id).update({
      numbers:{
        numCount: data.numCount,
        sends: data.sends + 1,
        error: err ? data.error + 1 : data.error 
      }
    })
  }
}

const getMessages = async () => {
  const messagesSending = await (await FS.collection("messages").where('finish', "!=", true).get()).docs
  const messagesSended = await (await FS.collection("messages").where('finish', "==", true).get()).docs

  var array1 =  messagesSending.map( d =>  d.data()).reverse()
  var array2 =  messagesSended.map( d =>  d.data())

  var arr = [...array1, ...array2]

  return arr
}

  // MAILS 

  const createMail = async (msg, numCount, deley, date) => {
    const id = uniqid()
  
    await FS.collection("mails").add({
      msg,
      id,
      date,
      numbers:{
        numCount,
        sends: 0,
        error: 0
      },
      deley,
      finish: false
    })
  
    return id
  }

  const sendMoreOneMail = async (id, err) => {
    const snapshot = await (await FS.collection("mails").where("id", "==", id).get()).docs[0]
  
    const data = await snapshot.data().numbers
  
    if(data.sends + 1 >= data.numCount){
      FS.collection("mails").doc(snapshot.id).update({
        numbers:{
          numCount: data.numCount,
          sends: data.sends + 1,
          error: err ? data.error + 1 : data.error 
        },
        finish: true
      })
      
    }else {
      FS.collection("mails").doc(snapshot.id).update({
        numbers:{
          numCount: data.numCount,
          sends: data.sends + 1,
          error: err ? data.error + 1 : data.error 
        }
      })
    }
  }

  const getMails = async () => {
    const messagesSending = await (await FS.collection("mails").where('finish', "!=", true).get()).docs
    const messagesSended = await (await FS.collection("mails").where('finish', "==", true).get()).docs
  
    var array1 =  messagesSending.map( d =>  d.data()).reverse()
    var array2 =  messagesSended.map( d =>  d.data())
  
    var arr = [...array1, ...array2]
  
    return arr
  }

  //MAILS CONFIG

  const addEmail = async (mail, pass) =>  {
    await  FS.collection("emails").add({
      mail,
      pass,
      active: true
    })

    return true
  }

  const removeEmail = async (mail) => {{
    const email = await (await FS.collection("emails").where("mail", "==", mail).get()).docs[0]

    if(!email) return {error: true, msg: 'email não encontrado'}

    let emailSel = await FS.collection('emails').doc(email.id).delete()

    return {error: false, msg: "email removido com sucesso!"}
  }}

  const getEmails = async () => {
    const emailsSnap = (await FS.collection('emails').where("active", '==', true).get()).docs
    const emails = emailsSnap.map(e => e.data())

    return emails
  }

  // addEmail("dgsayud@dsamdsh.com", '31231212')
  // addEmail("kjhjhggud@dsamdsh.com", '476712512')

module.exports = {
    loginByUser,
    createMessage,
    sendMoreOneMessage,
    getMessages,
    loginByToken,
    createMail,
    sendMoreOneMail,
    getMails,
    addEmail,
    removeEmail,
    getEmails
}