import '@mkeeorg/federation-ui/dist/index.css';
import { loadRemoteEntry, loadRemoteModule } from './mf';

const searchParams = new URL(document.location).searchParams;

const getUrlOverload = (appName) => {
  return searchParams.get(`_${appName}`);
};

const getAdditionalPlugin = () => {
  const app_name = searchParams.get(`pluginName`);
  const url = searchParams.get(`pluginUrl`);
  const path = searchParams.get('pluginPath');

  if (app_name && url && path) {
    return {
      app_name,
      url,
      path,
    };
  }
};

const getPluginConfig = async () => {
  if (window.appPlugins) {
    const storageKey = 'pluginOverwrite';

    const initialAppPlugins = (function getInitialValue() {
      const storedString = sessionStorage.getItem(storageKey);

      if (storedString) {
        const storedValue = JSON.parse(storedString);

        if (storedValue && Array.isArray(storedValue)) {
          return storedValue;
        }
      }

      return window.appPlugins;
    })();

    let hasOverwrite = false;

    const appPlugins = initialAppPlugins.map((plugin) => {
      const overwriteUrl = getUrlOverload(plugin.app_name);

      if (overwriteUrl) {
        hasOverwrite = true;

        return {
          ...plugin,
          url: overwriteUrl,
        };
      }

      return plugin;
    });

    const additionalPlugin = getAdditionalPlugin();

    if (additionalPlugin) {
      const currentPlugin = appPlugins.find(
        (plugin) => plugin.app_name === additionalPlugin.app_name
      );

      console.log({ currentPlugin, appPlugins, additionalPlugin });

      if (currentPlugin) {
        currentPlugin.url = additionalPlugin.url;
        currentPlugin.path = additionalPlugin.path;
      } else {
        appPlugins.push(additionalPlugin);
      }

      hasOverwrite = true;
    }

    const result = await Promise.all(
      appPlugins.map((plugin) =>
        loadRemoteEntry(`${plugin.url}/remoteEntry.js`, plugin.app_name)
          .then(() =>
            loadRemoteModule({
              remoteName: plugin.app_name,
              exposedModule: plugin.path,
            })
          )
          .then((m) => m.default)
      )
    );

    if (hasOverwrite) {
      sessionStorage.setItem(storageKey, JSON.stringify(appPlugins));
    }

    return result;
  }

  return [];
};

if (window.appUrls) {
  const storageKey = 'urlOverwrite';
  try {
    const storedString = sessionStorage.getItem(storageKey);

    if (storedString) {
      const storedValue = JSON.parse(storedString);

      if (storedValue && typeof storedValue === 'object') {
        window.appUrls = storedValue;
      }
    }

    let hasOverwrite = false;

    Object.keys(window.appUrls).forEach((key) => {
      const overwriteUrl = getUrlOverload(key);
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
