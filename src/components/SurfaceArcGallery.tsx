'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type GalleryItem = {
  code: string;
  name: string;
  collection: string;
  slug: string;
  imageUrl: string;
};

// Curated spread across collections — real catalog products, verified working images.
const ITEMS: GalleryItem[] = [
  { code: 'WY 5213D', name: 'Amerie Viola Noce', collection: 'Woods', slug: 'wy-5213d-amerie-viola-noce', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/5213.webp' },
  { code: 'DXO 15337D', name: 'Stoffa Crema', collection: 'Patterns', slug: 'dxo-15337d-stoffa-crema', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/15337.webp' },
  { code: 'SCT 15117LU', name: 'Marina', collection: 'Solids', slug: 'sct-15117lu-marina', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/15117.webp' },
  { code: 'WY 11271D', name: 'Valda Tivoli Elm', collection: 'Woods', slug: 'wy-11271d-valda-tivoli-elm', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/11271.webp' },
  { code: 'DXO 1108B', name: 'Nappa Black', collection: 'Patterns', slug: 'dxo-1108b-nappa-black', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1108.webp' },
  { code: 'SHG 1150', name: 'Taupe High Gloss', collection: 'Solids', slug: 'shg-1150-taupe-high-gloss', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1150.webp' },
  { code: 'WY 1260D', name: 'Chico Nevada Elm', collection: 'Woods', slug: 'wy-1260d-chico-nevada-elm', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1260.webp' },
  { code: 'DXP 1376K', name: 'Beige Escher Litho', collection: 'Patterns', slug: 'dxp-1376k-beige-escher-litho', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1376.webp' },
  { code: 'TSP 11165NC', name: 'Truffle Dune', collection: 'Solids', slug: 'tsp-11165nc-truffle-dune', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/11165.webp' },
  { code: 'WY 11281D', name: 'Aki Aomori Beech', collection: 'Woods', slug: 'wy-11281d-aki-aomori-beech', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/11281.webp' },
  { code: 'DXP 5345XM', name: 'Cato Steel', collection: 'Patterns', slug: 'dxp-5345xm-cato-steel', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/5345.webp' },
  { code: 'SCX 1170D', name: 'Hemlock', collection: 'Solids', slug: 'scx-1170d-hemlock', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1170.webp' },
  { code: 'WY 17210X', name: 'Zen Sagano Bamboo', collection: 'Woods', slug: 'wy-17210x-zen-sagano-bamboo', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/17210.webp' },
  { code: 'ARTE 1018D', name: 'Savile Regent', collection: 'Patterns', slug: 'arte-1018d-savile-regent', imageUrl: 'https://res.cloudinary.com/varindo/image/upload/product-images/1018.webp' },
];

const CARD_WIDTH = 88;
const CARD_HEIGHT = 118;
const SPREAD_DEG = 130;
const ROTATION_DAMPEN = 0.4;

export function SurfaceArcGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(960);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    resizeObserver.observe(el);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          visibilityObserver.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    visibilityObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const n = ITEMS.length;
  const halfSpreadRad = (SPREAD_DEG / 2) * (Math.PI / 180);
  const radius = Math.min(
    Math.max((containerWidth / 2 - CARD_WIDTH / 2 - 16) / Math.cos(halfSpreadRad), 160),
    480
  );

  // Rounded to 2dp: Math.cos/sin can differ in the last floating-point digit
  // between server (Node) and client (browser) engines, which otherwise
  // trips a React hydration mismatch on the serialized style string.
  const round = (n: number) => Math.round(n * 100) / 100;

  const positions = ITEMS.map((_, i) => {
    const angleDeg = -90 - SPREAD_DEG / 2 + (i * SPREAD_DEG) / (n - 1);
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = round(Math.cos(angleRad) * radius);
    const yFromApex = round(radius + Math.sin(angleRad) * radius);
    const rotation = round((angleDeg + 90) * ROTATION_DAMPEN);
    return { x, y: yFromApex, rotation };
  });

  const containerHeight = Math.max(...positions.map((p) => p.y)) + CARD_HEIGHT + 32;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[900px]"
      style={{ height: containerHeight }}
    >
      {ITEMS.map((item, i) => {
        const pos = positions[i];
        const isRevealed = visible || reducedMotion;
        const transitionDelay = reducedMotion ? '0ms' : `${i * 40}ms`;

        return (
          <Link
            key={item.code}
            href={`/products/${item.slug}`}
            aria-label={`${item.code} — ${item.name}`}
            className="group absolute left-1/2 top-0 block"
            style={{
              width: CARD_WIDTH,
              marginLeft: -CARD_WIDTH / 2,
              transform: isRevealed
                ? `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg) scale(1)`
                : `translate(${pos.x}px, ${pos.y + 36}px) rotate(0deg) scale(0.85)`,
              opacity: isRevealed ? 1 : 0,
              transition: reducedMotion
                ? 'none'
                : `transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease`,
              transitionDelay,
            }}
          >
            <div
              className="relative overflow-hidden rounded-xl border border-varindo-line shadow-card transition-shadow duration-300 group-hover:shadow-card-hover"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <Image
                src={item.imageUrl}
                alt={`${item.code} ${item.name}`}
                fill
                sizes="90px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-varindo-ink/90 to-transparent px-2 pb-2 pt-4 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-[8px] font-semibold tracking-[0.1em] text-varindo-gold uppercase leading-tight">{item.code}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
