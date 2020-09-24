import * as React from 'react';
import ReactDOM from 'react-dom';
import { appLoadNext } from './constant';
import './index.css';

const Content = React.lazy(() => import('./app/content'));

const NextContent = React.lazy(() => import('./next/content'));

const App = () => (
  <React.Suspense fallback="Loading...">
    <div>
      <h1>Main App</h1>
      <p>Hi there, I'm React from Webpack 5.</p>
    </div>
    {appLoadNext.content ? <NextContent /> : <Content />}
  </React.Suspense>
);

ReactDOM.render(<App />, document.getElementById('app'));
