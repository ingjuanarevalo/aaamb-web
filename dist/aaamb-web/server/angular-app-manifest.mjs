
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  assets: {
    'index.csr.html': {size: 14922, hash: 'c1e63970d6838c267a94a7ddf3227c0be7437a5866f48c8602775e15c86bf804', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 7994, hash: '34dc9881b22bdeb476ca68dce015b1f5142b83b7d10fc4535d12178373a4f919', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 24543, hash: 'edc1bb4d53756e3027b8e19b7a2b726a00d5a5fb774a89318341764654514403', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-HMPPZPNS.css': {size: 62942, hash: 'cUwbbl3C8X8', text: () => import('./assets-chunks/styles-HMPPZPNS_css.mjs').then(m => m.default)}
  },
};
