import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

import AbExploreMain from "./abexplore-index";

function AbExploreRouter()
{
  return <Router basename="/albums">
    <Switch>
      <Route path="/:targetpath*" component={AbExploreMain}/>
    </Switch>
  </Router>;
}

function main()
{
  ReactDOM.render(<AbExploreRouter/>,document.querySelector(".main"));
}

window.onload=main;