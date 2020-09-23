import React from "react";
import ReactDOM from "react-dom";

const Content = React.lazy(() => import('content/content'))

import "./index.css";

const App = () => 
<React.Suspense fallback="Loading...">
<div>
    <h1>Target</h1>
    Hi there, I'm React from Webpack 5.</div>
    <Content />
    </React.Suspense>;

ReactDOM.render(<App />, document.getElementById("app"));
