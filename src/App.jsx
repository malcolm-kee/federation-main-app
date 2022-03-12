import Header from 'marketing/header';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { appLoadNext } from './constants/feature-toggle';
import * as routes from './constants/routes';
import { HomePage } from './pages/home';

const Content = React.lazy(() =>
  appLoadNext.content ? import('miniNext/content') : import('mini/content')
);

const Career = React.lazy(() => import('career/career'));

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <Header />
    <React.Suspense fallback="Loading...">
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path={routes.detailsUrl} component={Content} />
          <Route path={routes.careerUrl} component={Career} />
          <Route path={routes.homeUrl} component={HomePage} exact />
        </Switch>
      </QueryClientProvider>
    </React.Suspense>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
