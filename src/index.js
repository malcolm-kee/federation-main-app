const federationEndpoint = process.env.FEDERATION_ENDPOINT;

fetch(federationEndpoint)
  .then((res) => res.json())
  .then(({ endpoints }) => {
    window._endpoints = endpoints;
    return import('./App');
  })
  .then(() => {
    console.log('done importing App in shell app');
  })
  .catch(() => {
    console.log('error importing App in shell app');
  });
