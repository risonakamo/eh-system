import React from "react";
import ReactDOM from "react-dom";

import "./abexplore-index.less";

class AbExploreMain extends React.Component
{

}

function main()
{
  ReactDOM.render(<AbExploreMain/>,document.querySelector(".main"));
}

window.onload=main;