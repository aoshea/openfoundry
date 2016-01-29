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
  transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
  support = { transitions : Modernizr.csstransitions };

function extend( a, b ) {
  for( var key in b ) {
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
    }
  }
  return a;
}

function stepsForm( el, options ) {
  this.el = el;
  this.options = extend( {}, this.options );
    extend( this.options, options );
    this._init();
}

stepsForm.prototype.options = {
  onSubmit : function() { return false; }
};

stepsForm.prototype._init = function() {
  // current question
  this.current = 0;

  // questions
  this.questions = [].slice.call( this.el.querySelectorAll( 'ol.questions > li' ) );

  // total questions
  this.questionsCount = this.questions.length;

  // show first question
  this.questions[0].classList.add('current' );

  // next question control
  this.ctrlNext = this.el.querySelector( 'button.next' );

  // progress bar
  this.progress = this.el.querySelector( 'div.progress' );

  // question number status
  this.questionStatus = this.el.querySelector( 'span.number' );

  // current question placeholder
  this.currentNum = this.questionStatus.querySelector( 'span.number-current' );
  this.currentNum.innerHTML = Number( this.current + 1 );

  // total questions placeholder
  this.totalQuestionNum = this.questionStatus.querySelector( 'span.number-total' );
  this.totalQuestionNum.innerHTML = this.questionsCount;

  // error message
  this.error = this.el.querySelector( 'span.error-message' );

  // init events
  this._initEvents();
};

stepsForm.prototype._initEvents = function() {
  var self = this,
    // first input
    firstElInput = this.questions[ this.current ].querySelector( 'input' ),
    // focus
    onFocusStartFn = function() {
      firstElInput.removeEventListener( 'focus', onFocusStartFn );
      self.ctrlNext.classList.add('show');
    };

  // show the next question control first time the input gets focused
  firstElInput.addEventListener( 'focus', onFocusStartFn );

  // show next question
  this.ctrlNext.addEventListener( 'click', function( ev ) {
    ev.preventDefault();
    self._nextQuestion();
  } );

  // pressing enter will jump to next question
  document.addEventListener( 'keydown', function( ev ) {
    var keyCode = ev.keyCode || ev.which;
    // enter
    if( keyCode === 13 ) {
      ev.preventDefault();
      self._nextQuestion();
    }
  } );

  // disable tab
  this.el.addEventListener( 'keydown', function( ev ) {
    var keyCode = ev.keyCode || ev.which;
    // tab
    if( keyCode === 9 ) {
      ev.preventDefault();
    }
  } );
};

stepsForm.prototype._nextQuestion = function() {
  if( !this._validade() ) {
    return false;
  }

  // check if form is filled
  if( this.current === this.questionsCount - 1 ) {
    this.isFilled = true;
  }

  // clear any previous error messages
  this._clearError();

  // current question
  var currentQuestion = this.questions[ this.current ];

  // increment current question iterator
  ++this.current;

  // update progress bar
  this._progress();

  if( !this.isFilled ) {
    // change the current question number/status
    this._updateQuestionNumber();

    // add class "show-next" to form element (start animations)
    this.el.classList.add('show-next');

    // remove class "current" from current question and add it to the next one
    // current question
    var nextQuestion = this.questions[ this.current ];
    currentQuestion.classList.remove('current');
    nextQuestion.classList.add('current');
  }

  // after animation ends, remove class "show-next" from form element and change current question placeholder
  var self = this,
    onEndTransitionFn = function( ev ) {
      if( support.transitions ) {
        this.removeEventListener( transEndEventName, onEndTransitionFn );
      }
      if( self.isFilled ) {
        self._submit();
      }
      else {
        self.el.classList.remove('show-next');
        self.currentNum.innerHTML = self.nextQuestionNum.innerHTML;
        self.questionStatus.removeChild( self.nextQuestionNum );
        // force the focus on the next input
        nextQuestion.querySelector( 'input' ).focus();
      }
    };

  if( support.transitions ) {
    this.progress.addEventListener( transEndEventName, onEndTransitionFn );
  }
  else {
    onEndTransitionFn();
  }
}

// updates the progress bar by setting its width
stepsForm.prototype._progress = function() {
  this.progress.style.width = this.current * ( 100 / this.questionsCount ) + '%';
}

// changes the current question number
stepsForm.prototype._updateQuestionNumber = function() {
  // first, create next question number placeholder
  this.nextQuestionNum = document.createElement( 'span' );
  this.nextQuestionNum.className = 'number-next';
  this.nextQuestionNum.innerHTML = Number( this.current + 1 );
  // insert it in the DOM
  this.questionStatus.appendChild( this.nextQuestionNum );
}

// submits the form
stepsForm.prototype._submit = function() {
  this.options.onSubmit( this.el );
}

// TODO (next version..)
// the validation function
stepsForm.prototype._validade = function() {
  // current question´s input
  var field = this.questions[ this.current ].querySelector( 'input' )
  var input = field.value;

  if( input === '' ) {
    this._showError( 'EMPTYSTR' );
    return false;
  }

  if( field.getAttribute('type') === 'email' && !validateEmail(input) ) {
    this._showError( 'INVALIDEMAIL' );
    return false;
  }

  return true;
}

// TODO (next version..)
stepsForm.prototype._showError = function( err ) {
  var message = '';
  switch( err ) {
    case 'EMPTYSTR' :
      message = 'Please fill the field before continuing';
      break;
    case 'INVALIDEMAIL' :
      message = 'Please fill a valid email address';
      break;
    // ...
  };
  this.error.innerHTML = message;
  this.error.classList.add('show' );
}

// clears/hides the current error message
stepsForm.prototype._clearError = function() {
  this.error.classList.remove('show');
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// add to global namespace
window.stepsForm = stepsForm