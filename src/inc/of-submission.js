var nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
// var transporter = nodemailer.createTransport('smtps://maildelivery1000%40gmail.com:bnoldgqxxvcemgil@smtp.gmail.com')
var transporter = nodemailer.createTransport({
  host: 'alpheca.uberspace.de',
  port: 587,
  secure: false, // use SSL
  requireTLS: true,
  auth: {
    user: 'submit@open-foundry.com',
    pass: '8WYYZpbzqg3K'
  }
})

// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'Open-Foundry <submit@open-foundry.com>', // sender address
  // to: 'Open-Foundry <hello@open-foundry.com>', // list of receivers
  subject: 'Font Submission', // Subject line,
}

function process (formdata, cb) {
  var result
  // do some form validation here

  result = {
    'status': 'success',
    'message': 'Thank you! We’ll be in touch.'
  }

  mailOptions.html = '<div style="line-height: 1.2em">'
  mailOptions.html += '<p>Hi ' + formdata.q1 + ',</p>'
  mailOptions.html += '<p>thanks so much for submitting ‘' + formdata.q3 + '’ to Open-Foundry.</p>'
  mailOptions.html += '<b>Your Name:</b> ' + formdata.q1 + '<br>'
  mailOptions.html += '<b>Font Email:</b> ' + formdata.q2 + '<br>'
  mailOptions.html += '<b>Font Name:</b> ' + formdata.q3 + '<br>'
  mailOptions.html += '<b>Open-Source:</b> ' + formdata.q4 + '<br>'
  mailOptions.html += '<b>Who made it:</b> ' + formdata.q5 + '<br>'
  mailOptions.html += '<b>Share Link:</b> ' + formdata.q6 + '<br>'
  mailOptions.html += '<p style="margin-top: 3em color: #cccccc">If you did not submit a font on open-foundry.com, please get in touch.</p>'
  mailOptions.html += '</div>'

  // mailOptions.html = '<b>Your Name:</b> ' + formdata.q1 + '<br>'
  // mailOptions.html += '<b>Your Email:</b> ' + formdata.q2 + '<br>'
  // mailOptions.html += '<b>Font Name:</b> ' + formdata.q3 + '<br>'
  // mailOptions.html += '<b>Open-Source:</b> ' + formdata.q4 + '<br>'
  // mailOptions.html += '<b>Who made it:</b> ' + formdata.q5 + '<br>'
  // mailOptions.html += '<b>Share Link:</b> ' + formdata.q6 + '<br>'
  // mailOptions.html += '<p style="margin-top:3em color:#cccccc">If you received this message in error and did not submit a font on <a href="http://open-foundry.com/">Open-Foundry</a>, please get in touch.</p>'

  // if (validateEmail(formdata.q2)) {
  //   mailOptions.to = formdata.q2
  //   mailOptions.bcc += 'Open-Foundry <submit@open-foundry.com>'
  // }

  if (validateEmail(formdata.q2)) {
    mailOptions.to = formdata.q2
    mailOptions.bcc += 'Open-Foundry <submit@open-foundry.com>'
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
    var re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

module.exports = {
  process: process
}