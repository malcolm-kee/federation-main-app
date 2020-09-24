const getQueryString = (param) => {
  const params = new URL(document.location).searchParams;
  return params.get(param);
};

export const appLoadNext = {
  content: getQueryString('content') === 'next',
};
