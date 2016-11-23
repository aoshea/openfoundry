import React from 'react';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import OFApp from './of-app';
import Hot30 from 'containers/hot30/hot30';
import About from 'containers/about';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={OFApp}>
        <IndexRedirect to="/hot30" />
        <Route path="/hot30" component={Hot30} />
        <Route path="/hot30/:fontId" component={Hot30} />
        <Route path="about" component={About} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.of-container')
)