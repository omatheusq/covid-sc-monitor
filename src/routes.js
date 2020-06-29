import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Chart from './pages/Chart'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Chart} exact/>
      </Switch>
    </BrowserRouter>
  );
}