import './index.css';

const federationEndpoint =
  process.env.FEDERATION_ENDPOINT ||
  'https://my-json-server.typicode.com/malcolm-kee/federation-api/endpoints';

fetch(federationEndpoint)
  .then((res) => res.json())
  .then((result) => {
    window.careerUrl = result.career;
    return import('./App');
  });
