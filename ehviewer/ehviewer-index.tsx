import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

import "./ehviewer-index.less";

class EhViewerMain extends React.Component
{
  render()
  {
    return <Router>
      <Switch>
        <Route component={TestComponent}/>
      </Switch>
    </Router>;
  }
}

class TestComponent extends React.Component
{
  props:{
    location:Location
  }

  componentDidMount()
  {
    console.log("mounted");
  }

  render()
  {
    console.log(this.props.location);
    return <div>{this.props.location.pathname}</div>;
  }
}

function main()
{
  ReactDOM.render(<EhViewerMain/>,document.querySelector(".main"));
}

window.onload=main;