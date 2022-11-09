import { loadRemoteEntry, loadRemoteModule } from '../mf';

const pluginStorageKey = 'pluginOverwrite';

const searchParams = new URL(document.location).searchParams;
const getUrlOverload = (appName) => {
  return searchParams.get(`_${appName}`);
};

/**
 *
 * @returns {Array<any>}
 */
const getInitialPluginValue = () => {
  const storedString = sessionStorage.getItem(pluginStorageKey);

  if (storedString) {
    const storedValue = JSON.parse(storedString);

    if (storedValue && Array.isArray(storedValue)) {
      return storedValue;
    }
  }

  return window.appPlugins ?? [];
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

export const pluginService = {
  getPlugins: async () => {
    const initialAppPlugins = getInitialPluginValue();

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

      if (currentPlugin) {
        currentPlugin.url = additionalPlugin.url;
        currentPlugin.path = additionalPlugin.path;
      } else {
        appPlugins.push(additionalPlugin);
      }

      hasOverwrite = true;
    }

    const remotePlugins = await Promise.all(
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
      sessionStorage.setItem(pluginStorageKey, JSON.stringify(appPlugins));
    }

    return remotePlugins;
  },
  addPlugin(plugin) {
    const plugins = getInitialPluginValue();
    const newPlugins = plugins.concat(plugin);

    sessionStorage.setItem(pluginStorageKey, JSON.stringify(newPlugins));
    window.location.reload();
  },
  resetPlugins() {
    sessionStorage.removeItem(pluginStorageKey);
    window.location.reload();
  },
};

const urlStorageKey = 'urlOverwrite';

const getStoredAppsUrl = () => {
  try {
    const storedString = sessionStorage.getItem(urlStorageKey);

    if (storedString) {
      const storedValue = JSON.parse(storedString);

      if (storedValue && typeof storedValue === 'object') {
        return storedValue;
      }
    }
  } catch (err) {}
};

export const remoteUrlService = {
  init: () => {
    window.appUrls = window.appUrls ?? {};

    try {
      const storedValue = getStoredAppsUrl();

      if (storedValue) {
        window.appUrls = storedValue;
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
        sessionStorage.setItem(urlStorageKey, JSON.stringify(window.appUrls));
      }
    } catch (err) {}
  },
  overwriteUrl: (appName, url) => {
    const values = getStoredAppsUrl() || window.appUrls;
    sessionStorage.setItem(
      urlStorageKey,
      JSON.stringify({
        ...values,
        [appName]: url,
      })
    );
    window.location.reload();
  },
  reset: () => {
    sessionStorage.removeItem(urlStorageKey);
    window.location.reload();
  },
};
