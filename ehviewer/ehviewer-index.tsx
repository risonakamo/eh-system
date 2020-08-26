import React from "react";
import ReactDOM from "react-dom";

import "./ehviewer-index.less";

class EhViewerMain extends React.Component
{
  render()
  {
    return <div>hi</div>;
  }
}

function main()
{
  ReactDOM.render(<EhViewerMain/>,document.querySelector(".main"));
}

window.onload=main;