import { onRequest, onRequestOptions } from './api/[[path]].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // If it's an API route, delegate to the edge API handler
    if (url.pathname.startsWith('/api/') || url.pathname === '/api') {
      if (request.method === 'OPTIONS') {
        return onRequestOptions();
      }

      // Extract path segments after /api/
      const apiPath = url.pathname.replace(/^\/api\/?/, '');
      const pathSegments = apiPath ? apiPath.split('/') : [];

      const context = {
        request,
        env,
        params: { path: pathSegments },
        waitUntil: ctx?.waitUntil ? (promise) => ctx.waitUntil(promise) : () => {},
        next: () => env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not Found', { status: 404 })
      };

      return onRequest(context);
    }

    // Otherwise serve static frontend assets (dist/)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Assets binding not available', { status: 500 });
  }
};
