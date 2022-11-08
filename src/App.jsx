import {
  Header,
  PluginContextProvider,
  usePluginRoutes,
} from '@mkeeorg/federation-ui';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as routes from './constants/routes';
import { HomePage } from './pages/home';

const Content = React.lazy(() => import('mini/content'));

const queryClient = new QueryClient();

const App = () => {
  const pluginRoutes = usePluginRoutes();

  return (
    <BrowserRouter>
      <Header showPluginNavItems />
      <React.Suspense fallback="Loading...">
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route path={routes.detailsUrl} component={Content} />
            {pluginRoutes &&
              pluginRoutes.map((route) => (
                <Route
                  path={route.path}
                  component={route.component}
                  key={`${route.appName}-${route.path}`}
                />
              ))}
            <Route path={routes.homeUrl} component={HomePage} exact />
          </Switch>
        </QueryClientProvider>
      </React.Suspense>
    </BrowserRouter>
  );
};

export function bootstrap(plugins) {
  ReactDOM.render(
    <PluginContextProvider value={plugins}>
      <App />
    </PluginContextProvider>,
    document.getElementById('app')
  );
}
