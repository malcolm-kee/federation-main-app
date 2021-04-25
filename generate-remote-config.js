const fetch = require('node-fetch');

/**
 * Get the remoteEntry file by fetching the manifest.json file from the target application.
 *
 * @param {string} url
 * @param {string} name
 * @returns
 */
module.exports = async function getRemoteConfig(url, name) {
  const req = await fetch(`${url}/manifest.json`);
  const result = await req.json();

  const finalResult = `${name}@${result[`${name}.js`]}`;

  return finalResult;
};
