const loadMessages = () => {
  let loadAppI18nPromise = import(
    './i18n/data/en.json' /* webpackChunkName: "app-i18n-en" */
  );

  return loadAppI18nPromise.then(
    (result) => result.default,
    (error) => {
      // eslint-disable-next-line no-console
      console.warn(
        'Something went wrong while loading the app messages',
        error
      );

      return {};
    }
  );
};

export default loadMessages;
