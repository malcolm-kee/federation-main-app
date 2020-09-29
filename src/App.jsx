import * as React from 'react';
import ReactDOM from 'react-dom';
import { Header } from './components/header';
import { Container } from './components/container';
import { appLoadNext } from './constant';
import './index.css';

const Content = React.lazy(() =>
  appLoadNext.content
    ? import('contentNext/content')
    : import('content/content')
);

const App = () => (
  <>
    <Header />
    <Container>
      <h1 className="text-5xl">Main App</h1>
      <p>Hi there, I'm React from Webpack 5.</p>
    </Container>
    <React.Suspense fallback="Loading...">
      <Content />
    </React.Suspense>
  </>
);

ReactDOM.render(<App />, document.getElementById('app'));
