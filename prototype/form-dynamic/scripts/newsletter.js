;(function () {

  var form = document.getElementById('newsletter-form')
  if (!form) { return }

  console.log('newsletter')

  form.addEventListener('submit', onSubmit)


  function onSubmit (e) {
    e.preventDefault()


    $.ajax({
      url: 'newsletter-submit',
      type: 'post',
      dataType: 'json',
      data: $(form).serialize(),
      success: onSuccess
    })





    // b_73b581b4d34df10e79efdd0ab_53d6e63058
  }


  function onSuccess (data) {
    console.log(data)
  }

}())