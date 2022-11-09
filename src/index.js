import '@mkeeorg/federation-ui/dist/index.css';
import { pluginService, remoteUrlService } from './services/remote-overwrite';

remoteUrlService.init();

pluginService
  .getPlugins()
  .then((plugins) => import('./App').then((m) => m.bootstrap(plugins)));
