import * as React from 'react';
import ReactDOM from 'react-dom';
import { Header } from './components/header';
import { appLoadNext } from './constant';

const Container = React.lazy(() => import('./components/container'));

const Content = React.lazy(() =>
  appLoadNext.content
    ? import('contentNext/content')
    : import('content/content')
);

const App = () => (
  <>
    <React.Suspense fallback="Loading...">
      <Header />
      <Container>
        <h1 className="text-5xl">Main App</h1>
        <p>Hi there, I'm React from Webpack 5.</p>
      </Container>
      <Content />
    </React.Suspense>
  </>
);

ReactDOM.render(<App />, document.getElementById('app'));
