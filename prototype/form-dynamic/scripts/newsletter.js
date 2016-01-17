;(function () {

  var form = document.getElementById('newsletter-form')
  if (!form) { return }

  var messageEl = form.querySelector( '.final-message' )

  var stepsForm = require('./stepsform')

  new stepsForm(form, { onSubmit: onSubmit })

  function onSubmit (form) {

    // hide form
    form.querySelector('.simform-inner').classList.add('hide')

    $.ajax({
      url: '/newsletter-submit',
      type: 'post',
      dataType: 'json',
      data: $(form).serialize(),
      success: onSuccess
    })
  }

  function onSuccess (data) {
    if (data.status === 'success') {
      messageEl.innerHTML = data.message
    } else {
      messageEl.innerHTML = data.message
    }
    messageEl.classList.add('show')
  }

}())