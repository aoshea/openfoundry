import React, { Component } from 'react';
import { render } from 'react-dom';
import FontList from './components/font-list/font-list.js';

let data = window.siteJSON;

render(
  <FontList fonts={data} />,
  document.querySelector('.of-container')
);  