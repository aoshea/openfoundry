var stepsForm = require('./stepsform')

new stepsForm( document.getElementById('theForm'), { onSubmit: onSubmit })

function onSubmit (form) {
  // hide form
  theForm.querySelector('.simform-inner').classList.add('hide')

  // show loading spinner

  $.ajax({
    url: form.getAttribute('action'),
    type: 'post',
    dataType: 'json',
    data: $(form).serialize(),
    success: onSuccess
  })
}

function onSuccess (data) {


  // hide loading spinner

  var messageEl = theForm.querySelector( '.final-message' )


  if (data.status === 'success') {
    messageEl.innerHTML = data.message
  } else {
    messageEl.innerHTML = 'Sorry'
  }
  messageEl.classList.add('show')
}
