import * as React from 'react';
import ReactDOM from 'react-dom';
import { appLoadNext } from './constant';
import './index.css';

const Content = React.lazy(() =>
  appLoadNext.content
    ? import('contentNext/content')
    : import('content/content')
);

const App = () => (
  <React.Suspense fallback="Loading...">
    <div>
      <h1>Main App</h1>
      <p>Hi there, I'm React from Webpack 5.</p>
    </div>
    <Content />
  </React.Suspense>
);

ReactDOM.render(<App />, document.getElementById('app'));
