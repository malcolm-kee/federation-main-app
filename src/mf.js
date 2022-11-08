/*
 * Code shamelessly copied from `@angular-architects/module-federation`.
 */

const moduleMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;

/**
 *
 * @param {string} remoteName
 * @param {string} exposedModule
 * @returns {Promise}
 */
async function lookupExposedModule(remoteName, exposedModule) {
  const container = window[remoteName];
  const factory = await container.get(exposedModule);
  const Module = factory();
  return Module;
}

/**
 *
 * @param {string} remoteName
 * @returns
 */
async function initRemote(remoteName) {
  const container = window[remoteName];

  // Do we still need to initialize the remote?
  if (remoteMap[remoteName]) {
    return container;
  }

  // Do we still need to initialize the share scope?
  if (!isDefaultScopeInitialized) {
    await __webpack_init_sharing__('default');
    isDefaultScopeInitialized = true;
  }

  await container.init(__webpack_share_scopes__.default);
  remoteMap[remoteName] = true;
  return container;
}

/**
 * Load remote entry file without any upfront configuration.
 *
 * @param {string} remoteEntry
 * @param {string} remoteName
 *
 * @return {Promise<void>}
 *
 */
export function loadRemoteEntry(remoteEntry, remoteName) {
  return new Promise((resolve, reject) => {
    // Is remoteEntry already loaded?
    if (moduleMap[remoteEntry]) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = remoteEntry;

    script.onerror = reject;

    script.onload = () => {
      initRemote(remoteName).then(() => {
        moduleMap[remoteEntry] = true;
        resolve();
      });
    };

    document.body.appendChild(script);
  });
}

/**
 * Load remote module without any configuration.
 *
 */
export async function loadRemoteModule(options) {
  if (options.remoteEntry) {
    await loadRemoteEntry(options.remoteEntry, options.remoteName);
  }
  return await lookupExposedModule(options.remoteName, options.exposedModule);
}
