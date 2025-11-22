const production = true;

export const environment = {
  production: production,
  baseFrontendUrl: 'https://www.comunikame.es',
  baseAppLinkUrl: 'https://comunikame.es',
  eventPath: 'web/event',
  baseBackendUrl: production 
    ? 'https://api.comunikame.es/' 
    : 'https://api.dev.comunikame.es/',
  sharerUrl: production 
    ? 'https://sharer.comunikame.es/' 
    : 'https://sharer.dev.comunikame.es/',
  mode: 'web'
};