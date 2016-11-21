import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import OFApp from './of-app';
import Hot30 from './containers/hot30';
import About from './containers/about';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={OFApp}>
        <IndexRedirect to="/hot30" />
        <Route path="/hot30" component={Hot30} />
        <Route path="about" component={About} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.of-container')
)