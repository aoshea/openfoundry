var nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
// var transporter = nodemailer.createTransport('smtps://maildelivery1000%40gmail.com:bnoldgqxxvcemgil@smtp.gmail.com')
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'maildelivery1000@gmail.com',
    pass: 'bnoldgqxxvcemgil'
  }
})

// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'Fred Foo 👥 <foo@blurdybloop.com>', // sender address
  to: 'wolfgang@unfun.de', // list of receivers
  subject: 'Hello ✔', // Subject line
}

function process (formdata, cb) {
  var result
  // do some form validation here

  result = {
    'status': 'success',
    'message': 'Thank you …'
  }

  mailOptions.html = '<ul>'
  mailOptions.html += '<li><b>Name:</b> ' + formdata.q1 + '</li>'
  mailOptions.html += '<li><b>Email:</b> ' + formdata.q2 + '</li>'
  mailOptions.html += '<li><b>Font Name:</b> ' + formdata.q3 + '</li>'
  mailOptions.html += '<li><b>Open Source:</b> ' + formdata.q4 + '</li>'
  mailOptions.html += '<li><b>Who made it:</b> ' + formdata.q5 + '</li>'
  mailOptions.html += '<li><b>Share Link:</b> ' + formdata.q6 + '</li>'
  mailOptions.html += '</ul>'

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error)
    }
    console.log('Message sent: ' + info.response)

    cb(result)
  })

}

module.exports = {
  process: process
}
