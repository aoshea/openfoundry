(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./scripts/main.js":[function(require,module,exports){
'use strict';

var submission = require("/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/submission.js");
var newsletter = require("/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/newsletter.js");

},{"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/newsletter.js":"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/newsletter.js","/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/submission.js":"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/submission.js"}],"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/newsletter.js":[function(require,module,exports){
'use strict';

;(function () {

  var form = document.getElementById('newsletter-form');
  if (!form) {
    return;
  }

  var messageEl = form.querySelector('.final-message');

  var stepsForm = require("/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js");

  new stepsForm(form, { onSubmit: onSubmit });

  function onSubmit(form) {

    // hide form
    form.querySelector('.simform-inner').classList.add('hide');

    $.ajax({
      url: '/newsletter-submit',
      type: 'post',
      dataType: 'json',
      data: $(form).serialize(),
      success: onSuccess
    });
  }

  function onSuccess(data) {
    if (data.status === 'success') {
      messageEl.innerHTML = data.message;
    } else {
      messageEl.innerHTML = data.message;
    }
    messageEl.classList.add('show');
  }
})();

},{"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js":"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js"}],"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js":[function(require,module,exports){
/**
 * stepsForm.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */

'use strict';

var transEndEventNames = {
  'WebkitTransition': 'webkitTransitionEnd',
  'MozTransition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'msTransition': 'MSTransitionEnd',
  'transition': 'transitionend'
},
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    support = { transitions: Modernizr.csstransitions };

function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

function stepsForm(el, options) {
  this.el = el;
  this.options = extend({}, this.options);
  extend(this.options, options);
  this._init();
}

stepsForm.prototype.options = {
  onSubmit: function onSubmit() {
    return false;
  }
};

stepsForm.prototype._init = function () {
  // current question
  this.current = 0;

  // questions
  this.questions = [].slice.call(this.el.querySelectorAll('ol.questions > li'));

  // total questions
  this.questionsCount = this.questions.length;

  // show first question
  this.questions[0].classList.add('current');

  // next question control
  this.ctrlNext = this.el.querySelector('button.next');

  // progress bar
  this.progress = this.el.querySelector('div.progress');

  // question number status
  this.questionStatus = this.el.querySelector('span.number');

  // current question placeholder
  this.currentNum = this.questionStatus.querySelector('span.number-current');
  this.currentNum.innerHTML = Number(this.current + 1);

  // total questions placeholder
  this.totalQuestionNum = this.questionStatus.querySelector('span.number-total');
  this.totalQuestionNum.innerHTML = this.questionsCount;

  // error message
  this.error = this.el.querySelector('span.error-message');

  // init events
  this._initEvents();
};

stepsForm.prototype._initEvents = function () {
  var self = this,

  // first input
  firstElInput = this.questions[this.current].querySelector('input'),

  // focus
  onFocusStartFn = function onFocusStartFn() {
    firstElInput.removeEventListener('focus', onFocusStartFn);
    self.ctrlNext.classList.add('show');
  };

  // show the next question control first time the input gets focused
  firstElInput.addEventListener('focus', onFocusStartFn);

  // show next question
  this.ctrlNext.addEventListener('click', function (ev) {
    ev.preventDefault();
    self._nextQuestion();
  });

  // pressing enter will jump to next question
  document.addEventListener('keydown', function (ev) {
    var keyCode = ev.keyCode || ev.which;
    // enter
    if (keyCode === 13) {
      ev.preventDefault();
      self._nextQuestion();
    }
  });

  // disable tab
  this.el.addEventListener('keydown', function (ev) {
    var keyCode = ev.keyCode || ev.which;
    // tab
    if (keyCode === 9) {
      ev.preventDefault();
    }
  });
};

stepsForm.prototype._nextQuestion = function () {
  if (!this._validade()) {
    return false;
  }

  // check if form is filled
  if (this.current === this.questionsCount - 1) {
    this.isFilled = true;
  }

  // clear any previous error messages
  this._clearError();

  // current question
  var currentQuestion = this.questions[this.current];

  // increment current question iterator
  ++this.current;

  // update progress bar
  this._progress();

  if (!this.isFilled) {
    // change the current question number/status
    this._updateQuestionNumber();

    // add class "show-next" to form element (start animations)
    this.el.classList.add('show-next');

    // remove class "current" from current question and add it to the next one
    // current question
    var nextQuestion = this.questions[this.current];
    currentQuestion.classList.remove('current');
    nextQuestion.classList.add('current');
  }

  // after animation ends, remove class "show-next" from form element and change current question placeholder
  var self = this,
      onEndTransitionFn = function onEndTransitionFn(ev) {
    if (support.transitions) {
      this.removeEventListener(transEndEventName, onEndTransitionFn);
    }
    if (self.isFilled) {
      self._submit();
    } else {
      self.el.classList.remove('show-next');
      self.currentNum.innerHTML = self.nextQuestionNum.innerHTML;
      self.questionStatus.removeChild(self.nextQuestionNum);
      // force the focus on the next input
      nextQuestion.querySelector('input').focus();
    }
  };

  if (support.transitions) {
    this.progress.addEventListener(transEndEventName, onEndTransitionFn);
  } else {
    onEndTransitionFn();
  }
};

// updates the progress bar by setting its width
stepsForm.prototype._progress = function () {
  this.progress.style.width = this.current * (100 / this.questionsCount) + '%';
};

// changes the current question number
stepsForm.prototype._updateQuestionNumber = function () {
  // first, create next question number placeholder
  this.nextQuestionNum = document.createElement('span');
  this.nextQuestionNum.className = 'number-next';
  this.nextQuestionNum.innerHTML = Number(this.current + 1);
  // insert it in the DOM
  this.questionStatus.appendChild(this.nextQuestionNum);
};

// submits the form
stepsForm.prototype._submit = function () {
  this.options.onSubmit(this.el);
};

// TODO (next version..)
// the validation function
stepsForm.prototype._validade = function () {
  // current question´s input
  var input = this.questions[this.current].querySelector('input').value;
  if (input === '') {
    this._showError('EMPTYSTR');
    return false;
  }

  return true;
};

// TODO (next version..)
stepsForm.prototype._showError = function (err) {
  var message = '';
  switch (err) {
    case 'EMPTYSTR':
      message = 'Please fill the field before continuing';
      break;
    case 'INVALIDEMAIL':
      message = 'Please fill a valid email address';
      break;
    // ...
  };
  this.error.innerHTML = message;
  this.error.classList.add('show');
};

// clears/hides the current error message
stepsForm.prototype._clearError = function () {
  this.error.classList.remove('show');
};

// add to global namespace
module.exports = stepsForm;

},{}],"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/submission.js":[function(require,module,exports){
'use strict';

;(function () {
  var form = document.getElementById('theForm');

  if (!form) {
    return;
  }

  var stepsForm = require("/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js");

  new stepsForm(form, { onSubmit: onSubmit });

  function onSubmit(form) {
    // hide form
    form.querySelector('.simform-inner').classList.add('hide');

    // show loading spinner

    $.ajax({
      url: form.getAttribute('action'),
      type: 'post',
      dataType: 'json',
      data: $(form).serialize(),
      success: onSuccess
    });
  }

  function onSuccess(data) {
    // hide loading spinner

    var messageEl = form.querySelector('.final-message');

    if (data.status === 'success') {
      messageEl.innerHTML = data.message;
    } else {
      messageEl.innerHTML = 'Sorry';
    }
    messageEl.classList.add('show');
  }
})();

},{"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js":"/Applications/MAMP/htdocs/Projects/openfoundry/prototype/form-dynamic/scripts/stepsform.js"}]},{},["./scripts/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvQXBwbGljYXRpb25zL01BTVAvaHRkb2NzL1Byb2plY3RzL29wZW5mb3VuZHJ5L3Byb3RvdHlwZS9mb3JtLWR5bmFtaWMvc2NyaXB0cy9tYWluLmpzIiwiL0FwcGxpY2F0aW9ucy9NQU1QL2h0ZG9jcy9Qcm9qZWN0cy9vcGVuZm91bmRyeS9wcm90b3R5cGUvZm9ybS1keW5hbWljL3NjcmlwdHMvbmV3c2xldHRlci5qcyIsIi9BcHBsaWNhdGlvbnMvTUFNUC9odGRvY3MvUHJvamVjdHMvb3BlbmZvdW5kcnkvcHJvdG90eXBlL2Zvcm0tZHluYW1pYy9zY3JpcHRzL3N0ZXBzZm9ybS5qcyIsIi9BcHBsaWNhdGlvbnMvTUFNUC9odGRvY3MvUHJvamVjdHMvb3BlbmZvdW5kcnkvcHJvdG90eXBlL2Zvcm0tZHluYW1pYy9zY3JpcHRzL3N1Ym1pc3Npb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7Ozs7O0FDRHhDLENBQUMsQUFBQyxDQUFBLFlBQVk7O0FBRVosTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JELE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFBRSxXQUFNO0dBQUU7O0FBRXJCLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUUsZ0JBQWdCLENBQUUsQ0FBQTs7QUFFdEQsTUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBOztBQUV0QyxNQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTs7QUFFM0MsV0FBUyxRQUFRLENBQUUsSUFBSSxFQUFFOzs7QUFHdkIsUUFB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QTs7OztBQUkxRCxLQUFDLENBQUMsSUFBSSxDQUFDO0FBQ0wsU0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0FBQ2hDLFVBQUksRUFBRSxNQUFNO0FBQ1osY0FBUSxFQUFFLE1BQU07QUFDaEIsVUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDekIsYUFBTyxFQUFFLFNBQVM7S0FDbkIsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsV0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFOzs7QUFHeEIsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBRSxnQkFBZ0IsQ0FBRSxDQUFBOztBQUV0RCxRQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzdCLGVBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNuQyxNQUFNO0FBQ0wsZUFBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUE7S0FDOUI7QUFDRCxhQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNoQztDQUVGLENBQUEsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBzdWJtaXNzaW9uID0gcmVxdWlyZSgnLi9zdWJtaXNzaW9uJylcbnZhciBuZXdzbGV0dGVyID0gcmVxdWlyZSgnLi9uZXdzbGV0dGVyJylcbiIsIjsoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld3NsZXR0ZXItZm9ybScpXG4gIGlmICghZm9ybSkgeyByZXR1cm4gfVxuXG4gIHZhciBtZXNzYWdlRWwgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoICcuZmluYWwtbWVzc2FnZScgKVxuXG4gIHZhciBzdGVwc0Zvcm0gPSByZXF1aXJlKCcuL3N0ZXBzZm9ybScpXG5cbiAgbmV3IHN0ZXBzRm9ybShmb3JtLCB7IG9uU3VibWl0OiBvblN1Ym1pdCB9KVxuXG4gIGZ1bmN0aW9uIG9uU3VibWl0IChmb3JtKSB7XG5cbiAgICAvLyBoaWRlIGZvcm1cbiAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5zaW1mb3JtLWlubmVyJykuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAnL25ld3NsZXR0ZXItc3VibWl0JyxcbiAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBkYXRhOiAkKGZvcm0pLnNlcmlhbGl6ZSgpLFxuICAgICAgc3VjY2Vzczogb25TdWNjZXNzXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uU3VjY2VzcyAoZGF0YSkge1xuICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBtZXNzYWdlRWwuaW5uZXJIVE1MID0gZGF0YS5tZXNzYWdlXG4gICAgfSBlbHNlIHtcbiAgICAgIG1lc3NhZ2VFbC5pbm5lckhUTUwgPSBkYXRhLm1lc3NhZ2VcbiAgICB9XG4gICAgbWVzc2FnZUVsLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICB9XG5cbn0oKSkiLCIvKipcbiAqIHN0ZXBzRm9ybS5qcyB2MS4wLjBcbiAqIGh0dHA6Ly93d3cuY29kcm9wcy5jb21cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICpcbiAqIENvcHlyaWdodCAyMDE0LCBDb2Ryb3BzXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKi9cblxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgJ01velRyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgJ09UcmFuc2l0aW9uJzogJ29UcmFuc2l0aW9uRW5kJyxcbiAgICAnbXNUcmFuc2l0aW9uJzogJ01TVHJhbnNpdGlvbkVuZCcsXG4gICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCdcbiAgfSxcbiAgdHJhbnNFbmRFdmVudE5hbWUgPSB0cmFuc0VuZEV2ZW50TmFtZXNbIE1vZGVybml6ci5wcmVmaXhlZCggJ3RyYW5zaXRpb24nICkgXSxcbiAgc3VwcG9ydCA9IHsgdHJhbnNpdGlvbnMgOiBNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMgfTtcblxuZnVuY3Rpb24gZXh0ZW5kKCBhLCBiICkge1xuICBmb3IoIHZhciBrZXkgaW4gYiApIHtcbiAgICBpZiggYi5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBhO1xufVxuXG5mdW5jdGlvbiBzdGVwc0Zvcm0oIGVsLCBvcHRpb25zICkge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMub3B0aW9ucyA9IGV4dGVuZCgge30sIHRoaXMub3B0aW9ucyApO1xuICAgIGV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5zdGVwc0Zvcm0ucHJvdG90eXBlLm9wdGlvbnMgPSB7XG4gIG9uU3VibWl0IDogZnVuY3Rpb24oKSB7IHJldHVybiBmYWxzZTsgfVxufTtcblxuc3RlcHNGb3JtLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAvLyBjdXJyZW50IHF1ZXN0aW9uXG4gIHRoaXMuY3VycmVudCA9IDA7XG5cbiAgLy8gcXVlc3Rpb25zXG4gIHRoaXMucXVlc3Rpb25zID0gW10uc2xpY2UuY2FsbCggdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCAnb2wucXVlc3Rpb25zID4gbGknICkgKTtcblxuICAvLyB0b3RhbCBxdWVzdGlvbnNcbiAgdGhpcy5xdWVzdGlvbnNDb3VudCA9IHRoaXMucXVlc3Rpb25zLmxlbmd0aDtcblxuICAvLyBzaG93IGZpcnN0IHF1ZXN0aW9uXG4gIHRoaXMucXVlc3Rpb25zWzBdLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnICk7XG5cbiAgLy8gbmV4dCBxdWVzdGlvbiBjb250cm9sXG4gIHRoaXMuY3RybE5leHQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoICdidXR0b24ubmV4dCcgKTtcblxuICAvLyBwcm9ncmVzcyBiYXJcbiAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvciggJ2Rpdi5wcm9ncmVzcycgKTtcblxuICAvLyBxdWVzdGlvbiBudW1iZXIgc3RhdHVzXG4gIHRoaXMucXVlc3Rpb25TdGF0dXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoICdzcGFuLm51bWJlcicgKTtcblxuICAvLyBjdXJyZW50IHF1ZXN0aW9uIHBsYWNlaG9sZGVyXG4gIHRoaXMuY3VycmVudE51bSA9IHRoaXMucXVlc3Rpb25TdGF0dXMucXVlcnlTZWxlY3RvciggJ3NwYW4ubnVtYmVyLWN1cnJlbnQnICk7XG4gIHRoaXMuY3VycmVudE51bS5pbm5lckhUTUwgPSBOdW1iZXIoIHRoaXMuY3VycmVudCArIDEgKTtcblxuICAvLyB0b3RhbCBxdWVzdGlvbnMgcGxhY2Vob2xkZXJcbiAgdGhpcy50b3RhbFF1ZXN0aW9uTnVtID0gdGhpcy5xdWVzdGlvblN0YXR1cy5xdWVyeVNlbGVjdG9yKCAnc3Bhbi5udW1iZXItdG90YWwnICk7XG4gIHRoaXMudG90YWxRdWVzdGlvbk51bS5pbm5lckhUTUwgPSB0aGlzLnF1ZXN0aW9uc0NvdW50O1xuXG4gIC8vIGVycm9yIG1lc3NhZ2VcbiAgdGhpcy5lcnJvciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvciggJ3NwYW4uZXJyb3ItbWVzc2FnZScgKTtcblxuICAvLyBpbml0IGV2ZW50c1xuICB0aGlzLl9pbml0RXZlbnRzKCk7XG59O1xuXG5zdGVwc0Zvcm0ucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICAvLyBmaXJzdCBpbnB1dFxuICAgIGZpcnN0RWxJbnB1dCA9IHRoaXMucXVlc3Rpb25zWyB0aGlzLmN1cnJlbnQgXS5xdWVyeVNlbGVjdG9yKCAnaW5wdXQnICksXG4gICAgLy8gZm9jdXNcbiAgICBvbkZvY3VzU3RhcnRGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgZmlyc3RFbElucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdmb2N1cycsIG9uRm9jdXNTdGFydEZuICk7XG4gICAgICBzZWxmLmN0cmxOZXh0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICB9O1xuXG4gIC8vIHNob3cgdGhlIG5leHQgcXVlc3Rpb24gY29udHJvbCBmaXJzdCB0aW1lIHRoZSBpbnB1dCBnZXRzIGZvY3VzZWRcbiAgZmlyc3RFbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIG9uRm9jdXNTdGFydEZuICk7XG5cbiAgLy8gc2hvdyBuZXh0IHF1ZXN0aW9uXG4gIHRoaXMuY3RybE5leHQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ICkge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2VsZi5fbmV4dFF1ZXN0aW9uKCk7XG4gIH0gKTtcblxuICAvLyBwcmVzc2luZyBlbnRlciB3aWxsIGp1bXAgdG8gbmV4dCBxdWVzdGlvblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBldiApIHtcbiAgICB2YXIga2V5Q29kZSA9IGV2LmtleUNvZGUgfHwgZXYud2hpY2g7XG4gICAgLy8gZW50ZXJcbiAgICBpZigga2V5Q29kZSA9PT0gMTMgKSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2VsZi5fbmV4dFF1ZXN0aW9uKCk7XG4gICAgfVxuICB9ICk7XG5cbiAgLy8gZGlzYWJsZSB0YWJcbiAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBldiApIHtcbiAgICB2YXIga2V5Q29kZSA9IGV2LmtleUNvZGUgfHwgZXYud2hpY2g7XG4gICAgLy8gdGFiXG4gICAgaWYoIGtleUNvZGUgPT09IDkgKSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSApO1xufTtcblxuc3RlcHNGb3JtLnByb3RvdHlwZS5fbmV4dFF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIGlmKCAhdGhpcy5fdmFsaWRhZGUoKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBjaGVjayBpZiBmb3JtIGlzIGZpbGxlZFxuICBpZiggdGhpcy5jdXJyZW50ID09PSB0aGlzLnF1ZXN0aW9uc0NvdW50IC0gMSApIHtcbiAgICB0aGlzLmlzRmlsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIGNsZWFyIGFueSBwcmV2aW91cyBlcnJvciBtZXNzYWdlc1xuICB0aGlzLl9jbGVhckVycm9yKCk7XG5cbiAgLy8gY3VycmVudCBxdWVzdGlvblxuICB2YXIgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbIHRoaXMuY3VycmVudCBdO1xuXG4gIC8vIGluY3JlbWVudCBjdXJyZW50IHF1ZXN0aW9uIGl0ZXJhdG9yXG4gICsrdGhpcy5jdXJyZW50O1xuXG4gIC8vIHVwZGF0ZSBwcm9ncmVzcyBiYXJcbiAgdGhpcy5fcHJvZ3Jlc3MoKTtcblxuICBpZiggIXRoaXMuaXNGaWxsZWQgKSB7XG4gICAgLy8gY2hhbmdlIHRoZSBjdXJyZW50IHF1ZXN0aW9uIG51bWJlci9zdGF0dXNcbiAgICB0aGlzLl91cGRhdGVRdWVzdGlvbk51bWJlcigpO1xuXG4gICAgLy8gYWRkIGNsYXNzIFwic2hvdy1uZXh0XCIgdG8gZm9ybSBlbGVtZW50IChzdGFydCBhbmltYXRpb25zKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnc2hvdy1uZXh0Jyk7XG5cbiAgICAvLyByZW1vdmUgY2xhc3MgXCJjdXJyZW50XCIgZnJvbSBjdXJyZW50IHF1ZXN0aW9uIGFuZCBhZGQgaXQgdG8gdGhlIG5leHQgb25lXG4gICAgLy8gY3VycmVudCBxdWVzdGlvblxuICAgIHZhciBuZXh0UXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1sgdGhpcy5jdXJyZW50IF07XG4gICAgY3VycmVudFF1ZXN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcbiAgICBuZXh0UXVlc3Rpb24uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xuICB9XG5cbiAgLy8gYWZ0ZXIgYW5pbWF0aW9uIGVuZHMsIHJlbW92ZSBjbGFzcyBcInNob3ctbmV4dFwiIGZyb20gZm9ybSBlbGVtZW50IGFuZCBjaGFuZ2UgY3VycmVudCBxdWVzdGlvbiBwbGFjZWhvbGRlclxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgb25FbmRUcmFuc2l0aW9uRm4gPSBmdW5jdGlvbiggZXYgKSB7XG4gICAgICBpZiggc3VwcG9ydC50cmFuc2l0aW9ucyApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCB0cmFuc0VuZEV2ZW50TmFtZSwgb25FbmRUcmFuc2l0aW9uRm4gKTtcbiAgICAgIH1cbiAgICAgIGlmKCBzZWxmLmlzRmlsbGVkICkge1xuICAgICAgICBzZWxmLl9zdWJtaXQoKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzZWxmLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3ctbmV4dCcpO1xuICAgICAgICBzZWxmLmN1cnJlbnROdW0uaW5uZXJIVE1MID0gc2VsZi5uZXh0UXVlc3Rpb25OdW0uaW5uZXJIVE1MO1xuICAgICAgICBzZWxmLnF1ZXN0aW9uU3RhdHVzLnJlbW92ZUNoaWxkKCBzZWxmLm5leHRRdWVzdGlvbk51bSApO1xuICAgICAgICAvLyBmb3JjZSB0aGUgZm9jdXMgb24gdGhlIG5leHQgaW5wdXRcbiAgICAgICAgbmV4dFF1ZXN0aW9uLnF1ZXJ5U2VsZWN0b3IoICdpbnB1dCcgKS5mb2N1cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgaWYoIHN1cHBvcnQudHJhbnNpdGlvbnMgKSB7XG4gICAgdGhpcy5wcm9ncmVzcy5hZGRFdmVudExpc3RlbmVyKCB0cmFuc0VuZEV2ZW50TmFtZSwgb25FbmRUcmFuc2l0aW9uRm4gKTtcbiAgfVxuICBlbHNlIHtcbiAgICBvbkVuZFRyYW5zaXRpb25GbigpO1xuICB9XG59XG5cbi8vIHVwZGF0ZXMgdGhlIHByb2dyZXNzIGJhciBieSBzZXR0aW5nIGl0cyB3aWR0aFxuc3RlcHNGb3JtLnByb3RvdHlwZS5fcHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcm9ncmVzcy5zdHlsZS53aWR0aCA9IHRoaXMuY3VycmVudCAqICggMTAwIC8gdGhpcy5xdWVzdGlvbnNDb3VudCApICsgJyUnO1xufVxuXG4vLyBjaGFuZ2VzIHRoZSBjdXJyZW50IHF1ZXN0aW9uIG51bWJlclxuc3RlcHNGb3JtLnByb3RvdHlwZS5fdXBkYXRlUXVlc3Rpb25OdW1iZXIgPSBmdW5jdGlvbigpIHtcbiAgLy8gZmlyc3QsIGNyZWF0ZSBuZXh0IHF1ZXN0aW9uIG51bWJlciBwbGFjZWhvbGRlclxuICB0aGlzLm5leHRRdWVzdGlvbk51bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuICB0aGlzLm5leHRRdWVzdGlvbk51bS5jbGFzc05hbWUgPSAnbnVtYmVyLW5leHQnO1xuICB0aGlzLm5leHRRdWVzdGlvbk51bS5pbm5lckhUTUwgPSBOdW1iZXIoIHRoaXMuY3VycmVudCArIDEgKTtcbiAgLy8gaW5zZXJ0IGl0IGluIHRoZSBET01cbiAgdGhpcy5xdWVzdGlvblN0YXR1cy5hcHBlbmRDaGlsZCggdGhpcy5uZXh0UXVlc3Rpb25OdW0gKTtcbn1cblxuLy8gc3VibWl0cyB0aGUgZm9ybVxuc3RlcHNGb3JtLnByb3RvdHlwZS5fc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub3B0aW9ucy5vblN1Ym1pdCggdGhpcy5lbCApO1xufVxuXG4vLyBUT0RPIChuZXh0IHZlcnNpb24uLilcbi8vIHRoZSB2YWxpZGF0aW9uIGZ1bmN0aW9uXG5zdGVwc0Zvcm0ucHJvdG90eXBlLl92YWxpZGFkZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBjdXJyZW50IHF1ZXN0aW9uwrRzIGlucHV0XG4gIHZhciBpbnB1dCA9IHRoaXMucXVlc3Rpb25zWyB0aGlzLmN1cnJlbnQgXS5xdWVyeVNlbGVjdG9yKCAnaW5wdXQnICkudmFsdWU7XG4gIGlmKCBpbnB1dCA9PT0gJycgKSB7XG4gICAgdGhpcy5fc2hvd0Vycm9yKCAnRU1QVFlTVFInICk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFRPRE8gKG5leHQgdmVyc2lvbi4uKVxuc3RlcHNGb3JtLnByb3RvdHlwZS5fc2hvd0Vycm9yID0gZnVuY3Rpb24oIGVyciApIHtcbiAgdmFyIG1lc3NhZ2UgPSAnJztcbiAgc3dpdGNoKCBlcnIgKSB7XG4gICAgY2FzZSAnRU1QVFlTVFInIDpcbiAgICAgIG1lc3NhZ2UgPSAnUGxlYXNlIGZpbGwgdGhlIGZpZWxkIGJlZm9yZSBjb250aW51aW5nJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0lOVkFMSURFTUFJTCcgOlxuICAgICAgbWVzc2FnZSA9ICdQbGVhc2UgZmlsbCBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnO1xuICAgICAgYnJlYWs7XG4gICAgLy8gLi4uXG4gIH07XG4gIHRoaXMuZXJyb3IuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgdGhpcy5lcnJvci5jbGFzc0xpc3QuYWRkKCdzaG93JyApO1xufVxuXG4vLyBjbGVhcnMvaGlkZXMgdGhlIGN1cnJlbnQgZXJyb3IgbWVzc2FnZVxuc3RlcHNGb3JtLnByb3RvdHlwZS5fY2xlYXJFcnJvciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVycm9yLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbn1cblxuLy8gYWRkIHRvIGdsb2JhbCBuYW1lc3BhY2Vcbm1vZHVsZS5leHBvcnRzID0gc3RlcHNGb3JtOyIsIjsoZnVuY3Rpb24gKCkge1xuICB2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVGb3JtJylcblxuICBpZiAoIWZvcm0pIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdGVwc0Zvcm0gPSByZXF1aXJlKCcuL3N0ZXBzZm9ybScpXG5cbiAgbmV3IHN0ZXBzRm9ybShmb3JtLCB7IG9uU3VibWl0OiBvblN1Ym1pdCB9KVxuXG5cbiAgZnVuY3Rpb24gb25TdWJtaXQgKGZvcm0pIHtcbiAgICAvLyBoaWRlIGZvcm1cbiAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5zaW1mb3JtLWlubmVyJykuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG5cbiAgICAvLyBzaG93IGxvYWRpbmcgc3Bpbm5lclxuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogZm9ybS5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpLFxuICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIGRhdGE6ICQoZm9ybSkuc2VyaWFsaXplKCksXG4gICAgICBzdWNjZXNzOiBvblN1Y2Nlc3NcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25TdWNjZXNzIChkYXRhKSB7XG4gICAgLy8gaGlkZSBsb2FkaW5nIHNwaW5uZXJcblxuICAgIHZhciBtZXNzYWdlRWwgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoICcuZmluYWwtbWVzc2FnZScgKVxuXG4gICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG1lc3NhZ2VFbC5pbm5lckhUTUwgPSBkYXRhLm1lc3NhZ2VcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9ICdTb3JyeSdcbiAgICB9XG4gICAgbWVzc2FnZUVsLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICB9XG5cbn0oKSlcbiJdfQ==
