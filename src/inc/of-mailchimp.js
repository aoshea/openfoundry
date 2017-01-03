var mcapi = require('mailchimp-api')

// set MailChimp API key here
var mc = new mcapi.Mailchimp('88fd1c36a985e31eb49c46361cde7860-us8')

module.exports = function (email, cb) {
  var result = {}
  console.log(email)
  mc.lists.subscribe({
    id: '53d6e63058',
    email: {
      email: email
    }
  }, function(data) {
    console.log(data)
    result.status = 'success'
    result.message = 'Thanks for subscribing!'
    cb(result)
  },
  function(error) {
    console.log(error)
    if (error.error) {
      result.status = 'error'
      result.message = error.error
      // return error.error
    } else {
      result.status = 'error'
      result.message = 'There was some error'
    }
    cb(result)
  })
}