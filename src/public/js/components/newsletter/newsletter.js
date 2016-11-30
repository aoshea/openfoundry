import React, { Component } from 'react'
import $ from 'jquery'

var CTA = "Join OF Club"

export default class NewsletterSignup extends Component {

  componentDidMount() {

    this.setupForm()

  }

  setupForm() {

    var form = this.refs.newsletterForm

    if (!form) {
      return
    }

    // setup step form
    this.stepForm = new window.stepsForm(form, { onSubmit: onSubmit })

    // remove 0/1 etc. since there's only one input
    this.stepForm.questionStatus.style.display = 'none'

    var messageEl = form.querySelector('.final-message')

    function onSubmit(form) {

      // hide form
      form.querySelector('.simform-inner').classList.add('hide')

      $.ajax({
        url: 'newsletter',
        type: 'post',
        dataType: 'json',
        data: $(form).serialize(),
        success: onSuccess
      })
    }

    function onSuccess(data) {
      if (data.status === 'success') {
        messageEl.innerHTML = data.message
      } else {
        messageEl.innerHTML = data.message
      }
      messageEl.classList.add('show')
    }
  }

  resetForm() {

    // resets call to action message
    $(this.stepForm.el).find('input').attr('placeholder', CTA)

    // hide final message and display form
    this.stepForm.el.querySelector('.final-message').classList.remove('show')
    this.stepForm.el.querySelector('.simform-inner').classList.remove('hide')

    // remove error messages
    this.stepForm.error.classList.remove('show')

    // reset all values
    this.stepForm.questions.forEach(function (el) {
      el.querySelector('input').value = ""
    })

    // remove next button
    this.stepForm.ctrlNext.classList.remove('show')

    // remove the progress bar
    this.stepForm.progress.style.width = '0'

  }

  render() {

    if (this.stepForm && this.props.menuOpen) {
      // reset the form each time the menu opens
      this.resetForm()
    }

    var onFocusInput = function (e) {
      // display default input placeholder
      e.target.placeholder = "Your E-Mail?"
      // display next arrow
      this.stepForm.ctrlNext.classList.add('show')
    }.bind(this)

    var onBlurInput = function (e) {
      if (e.target.value == "") {
        // if the field was left empty, hide the next arrow
        this.stepForm.ctrlNext.classList.remove('show')
      }
      // display cta message (if field is empty)
      e.target.placeholder = CTA
    }.bind(this)

    let hideStyle = {
      position: 'absolute',
      left: '-5000px'
    }

    return (
      <div className="newsletter-wrapper">
        <form ref="newsletterForm" id="newsletter-form" className="simform" action="submit" method="post">
          <div className="simform-inner">
            <ol className="questions">
              <li><input placeholder={CTA} type="email" name="EMAIL" onFocus={onFocusInput} onBlur={onBlurInput}/></li>
            </ol>
            <div style={hideStyle} aria-hidden="true">
              <input type="text" name="b_73b581b4d34df10e79efdd0ab_53d6e63058" tabIndex="-1" value="" />
            </div>
            <button className="submit" type="submit">Send</button>
            <div className="controls">
              <button className="next"></button>
              <div className="progress"></div>
              <span className="number">
                <span className="number-current"></span>
                <span className="number-total"></span>
              </span>
              <span className="error-message"></span>
            </div>
          </div>
          <span className="final-message"></span>
        </form>
      </div>
    )
  }

}
