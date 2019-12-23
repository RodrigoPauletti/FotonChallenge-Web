import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Register from './pages/register';
import Main from './pages/main';
import Task from './pages/task';
import New from './pages/new';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Main} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/task/:id' component={Task} />
      <Route path='/new' component={New} />
    </Switch>
  </BrowserRouter>
);

export default Routes;