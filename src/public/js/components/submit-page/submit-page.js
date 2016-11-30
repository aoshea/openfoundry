import React, { Component } from 'react'
import $ from 'jquery'

export default class SubmitPage extends Component {

  constructor() {

    super()

    this.onFocusInput = this.onFocusInput.bind(this)
    this.onBlurInput = this.onBlurInput.bind(this)

  }

  componentDidMount() {

    this.setupForm()
  }

  setupForm() {

    var form = document.getElementById('theForm')

    if (!form) {
      return
    }

    this.stepForm = new window.stepsForm(form, { onSubmit: onSubmit })


    function onSubmit(form) {
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

    function onSuccess(data) {

      // hide loading spinner
      var messageEl = form.querySelector('.final-message')

      if (data.status === 'success') {
        messageEl.innerHTML = data.message
      } else {
        messageEl.innerHTML = 'Sorry'
      }
      messageEl.classList.add('show')
    }

  }

  onFocusInput(e) {
    if (e.target.id == 'q1') {
      e.target.placeholder = "Your name?"
    }
  }

  onBlurInput(e) {
    if (e.target.id == 'q1') {
      e.target.placeholder = "Submit a font"
    }
  }


  render() {

    return (
      <div className="submission-wrapper">
        <form id="theForm" className="simform" autoComplete="off" action="submit" method="post">
          <div className="simform-inner">
            <ol className="questions">
              <li><input id="q1" name="q1" placeholder="Submit a font" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="text"/></li>
              <li><input id="q2" name="q2" placeholder="Your Email?" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="email"/></li>
              <li><input id="q3" name="q3" placeholder="Font Name?" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="text"/></li>
              <li><input id="q4" name="q4" placeholder="Open-Source? [Yes/No]" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="text"/></li>
              <li><input id="q5" name="q5" placeholder="Who made it?" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="text"/></li>
              <li><input id="q6" name="q6" placeholder="Share Link?" onFocus={this.onFocusInput} onBlur={this.onBlurInput} type="text"/></li>
            </ol>
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
          <span className="loader"></span>
          <span className="final-message"></span>
        </form>
      </div>
    )
  }
}
