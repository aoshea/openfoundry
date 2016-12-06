import React from 'react'
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from 'reducers'
import OFApp from 'of-app'
import Hot30 from 'containers/hot30/hot30'
import About from 'containers/about'
import Submit from 'containers/submit/submit'
import Signup from 'containers/signup/signup'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const middleware = [thunk]

const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)))

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={OFApp}>
        <IndexRedirect to="/hot30" />
        <Route path="/hot30" component={Hot30} />
        <Route path="/hot30/:fontId" component={Hot30} />
        <Route path="about" component={About} />
        <Route path="submit" component={Submit} />
        <Route path="signup" component={Signup} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.of-container')
)
