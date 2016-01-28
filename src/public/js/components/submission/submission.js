import React, { Component } from 'react';
import $ from 'jquery';

export default class SubmissionPage extends Component {

  componentDidMount() {
    setupForm()
  }

  render() {
    return (
      <div className="submission-wrapper">
        <form id="theForm" className="simform" autoComplete="off" action="submit" method="post">
          <div className="simform-inner">
            <ol className="questions">
              <li><input id="q1" name="q1" placeholder="Your Name?" type="text"/></li>
              <li><input id="q2" name="q2" placeholder="Your Email?" type="email"/></li>
              <li><input id="q3" name="q3" placeholder="Font Name?" type="text"/></li>
              <li><input id="q4" name="q4" placeholder="Open-Source? [Yes/No]" type="text"/></li>
              <li><input id="q5" name="q5" placeholder="Who made it?" type="text"/></li>
              <li><input id="q6" name="q6" placeholder="Share Link?" type="text"/></li>
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

function setupForm() {
  var form = document.getElementById('theForm')

  if (!form) {
    return
  }

  new window.stepsForm(form, { onSubmit: onSubmit })


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