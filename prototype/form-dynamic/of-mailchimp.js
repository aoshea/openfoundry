var mcapi = require('./node_modules/mailchimp-api/mailchimp')
// set MailChimp API key here
var mc = new mcapi.Mailchimp('88fd1c36a985e31eb49c46361cde7860-us8')

module.exports = function (email) {
  mc.lists.subscribe({
    id: 53d6e63058,
    email: {
      email: email
    }
  }, function(result) {
    //result = User subscribed successfully! Look for the confirmation email.';
  },
  function(error) {
    if (error.error) {
      // return error.error
    } else {
      // return general error message
    }

  })
}