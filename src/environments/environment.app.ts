const production = true;

export const environment = {
  production: production,
  baseFrontendUrl: 'https://www.comunikame.es',
  baseAppLinkUrl: 'https://comunikame.es',
  eventPath: 'web/event',
  baseBackendUrl: production 
    ? 'https://jsvtvde9gc.execute-api.eu-west-2.amazonaws.com/prod/' 
    : 'https://19dlqvyf7c.execute-api.eu-west-1.amazonaws.com/dev/',
  mode: 'app'
};
