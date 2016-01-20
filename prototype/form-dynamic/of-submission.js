var nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
// var transporter = nodemailer.createTransport('smtps://maildelivery1000%40gmail.com:bnoldgqxxvcemgil@smtp.gmail.com')
var transporter = nodemailer.createTransport({
  host: 'alpheca.uberspace.de',
  port: 587,
  secure: false, // use SSL
  requireTLS: true,
  auth: {
    user: 'noreply@open-foundry.com',
    pass: '8WYYZpbzqg3K'
  }
})

// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'Open-Foundry <noreply@open-foundry.com>', // sender address
  to: 'hello@open-foundry.com', // list of receivers
  subject: 'OF Submission', // Subject line,
}

function process (formdata, cb) {
  var result
  // do some form validation here

  result = {
    'status': 'success',
    'message': 'Thank you! We’ll be in touch.'
  }

  mailOptions.html = '<b>Name:</b> ' + formdata.q1 + '<br>'
  mailOptions.html += '<b>Email:</b> ' + formdata.q2 + '<br>'
  mailOptions.html += '<b>Font Name:</b> ' + formdata.q3 + '<br>'
  mailOptions.html += '<b>Open Source:</b> ' + formdata.q4 + '<br>'
  mailOptions.html += '<b>Who made it:</b> ' + formdata.q5 + '<br>'
  mailOptions.html += '<b>Share Link:</b> ' + formdata.q6 + '<br>'

  if (validateEmail(formdata.q2)) {
    mailOptions.bcc = formdata.q2
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error)
    }
    console.log('Message sent: ' + info.response)

    cb(result)
  })
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = {
  process: process
}