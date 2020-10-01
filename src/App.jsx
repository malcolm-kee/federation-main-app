import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/header';
import { appLoadNext } from './constants/feature-toggle';
import * as routes from './constants/routes';
import { HomePage } from './pages/home';

const Content = React.lazy(() =>
  appLoadNext.content
    ? import('contentNext/content')
    : import('content/content')
);

const App = () => (
  <BrowserRouter>
    <Header />
    <React.Suspense fallback="Loading...">
      <Switch>
        <Route path={routes.detailsUrl} component={Content} />
        <Route path={routes.homeUrl} component={HomePage} exact />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
