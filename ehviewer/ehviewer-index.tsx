import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

import "./ehviewer-index.less";

class EhViewerMainRouter extends React.Component
{
  render()
  {
    return <Router>
      <Switch>
        <Route component={EhViewerMain}/>
      </Switch>
    </Router>;
  }
}

class EhViewerMain extends React.Component
{
  render()
  {
    return <div>hi</div>;
  }
}

function main()
{
  ReactDOM.render(<EhViewerMainRouter/>,document.querySelector(".main"));
}

window.onload=main;