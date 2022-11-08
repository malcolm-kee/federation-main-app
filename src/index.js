import '@mkeeorg/federation-ui/dist/index.css';
import { loadRemoteEntry, loadRemoteModule } from './mf';

const getPluginConfig = async () => {
  if (window.appPlugins) {
    return Promise.all(
      window.appPlugins.map((plugin) =>
        loadRemoteEntry(`${plugin.url}/remoteEntry.js`, plugin.app_name)
          .then(() =>
            loadRemoteModule({
              remoteName: plugin.app_name,
              exposedModule: plugin.path,
              remoteEntry: plugin.url,
            })
          )
          .then((m) => m.default)
      )
    );
  }

  return [];
};

const storageKey = 'urlOverwrite';

if (window.appUrls) {
  try {
    const storedString = sessionStorage.getItem(storageKey);

    if (storedString) {
      const storedValue = JSON.parse(storedString);

      if (storedValue && typeof storedValue === 'object') {
        window.appUrls = storedValue;
      }
    }

    const searchParams = new URL(document.location).searchParams;

    let hasOverwrite = false;

    Object.keys(window.appUrls).forEach((key) => {
      const overwriteUrl = searchParams.get(`_${key}`);
      if (overwriteUrl) {
        window.appUrls[key] = overwriteUrl;
        hasOverwrite = true;
      }
    });

    if (hasOverwrite) {
      sessionStorage.setItem(storageKey, JSON.stringify(window.appUrls));
    }
  } catch (err) {}
}

getPluginConfig().then((plugins) =>
  import('./App').then((m) => m.bootstrap(plugins))
);
