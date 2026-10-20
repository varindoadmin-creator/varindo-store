import type { MetadataRoute } from 'next';

// The store runs on store.varindo.co.id and, until it launches, serves the same
// pages as varindo.co.id. Keep it out of search so it never competes with the
// live site; every page's canonical URL still points at varindo.co.id.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/'
    }
  };
}
