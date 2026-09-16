import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products';
import { slugify } from '@/lib/utils';

/**
 * Same-origin download for a product swatch.
 *
 * The zoom dialog used to link straight at the Cloud Storage object with a
 * `download` attribute, but `download` is ignored cross-origin — the browser
 * opened the .webp in a tab instead of saving it, and the saved name was the
 * design slug ("lunigiana-uno.webp"), not the product. This route re-serves the
 * same bytes from varindo.co.id, so `download` applies and the file lands with
 * a name a customer can file.
 *
 * It takes a product slug, never a URL: the upstream address is derived from
 * our own catalogue (imageUrl is always getSwatchUrl(design) — the CSV carries
 * no image columns), so this can't be pointed at an arbitrary host.
 */

export const revalidate = 600;

// Swatch objects are immutable (max-age=31536000) and versioned via ?v= in
// getSwatchUrl, so the proxied response is just as cacheable as the original.
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const EXTENSIONS: Record<string, string> = {
  'image/webp': '.webp',
  'image/jpeg': '.jpg',
  'image/png': '.png'
};

function extensionFor(url: string, contentType: string) {
  const fromPath = new URL(url).pathname.match(/\.(webp|jpe?g|png)$/i);
  if (fromPath) return fromPath[0].toLowerCase().replace('.jpeg', '.jpg');
  return EXTENSIONS[contentType.split(';')[0].trim().toLowerCase()] || '.webp';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product?.imageUrl) {
    return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
  }

  const upstream = await fetch(product.imageUrl, { cache: 'force-cache' });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { success: false, error: 'Image could not be fetched' },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get('content-type') || 'image/webp';
  // slugify() already limits this to [a-z0-9-], so the name needs no further
  // escaping to be safe in a Content-Disposition header.
  const filename = `lamitak-${slugify(product.slug)}${extensionFor(product.imageUrl, contentType)}`;
  const contentLength = upstream.headers.get('content-length');

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': CACHE_CONTROL,
      ...(contentLength ? { 'Content-Length': contentLength } : {})
    }
  });
}
