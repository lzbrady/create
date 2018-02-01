import React from "react";
import {Switch, Route} from "react-router-dom";

import Detail from "../Detail/Detail";
import CreationList from '../CreationList/CreationList'

const Home = () => (
  <Switch>
    <Route exact path='/' component={CreationList}/>
    <Route path='/view/:String' component={Detail}/>
  </Switch>
)

export default Home;