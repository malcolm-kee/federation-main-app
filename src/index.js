import '@mkeeorg/federation-ui/dist/index.css';

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

import('./App');
