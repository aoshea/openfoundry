;(function () {
  var form = document.getElementById('theForm')

  if (!form) {
    return
  }

  var stepsForm = require('./stepsform')

  new stepsForm(form, { onSubmit: onSubmit })


  function onSubmit (form) {
    // hide form
    form.querySelector('.simform-inner').classList.add('hide')

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

    var messageEl = form.querySelector( '.final-message' )

    if (data.status === 'success') {
      messageEl.innerHTML = data.message
    } else {
      messageEl.innerHTML = 'Sorry'
    }
    messageEl.classList.add('show')
  }

}())
