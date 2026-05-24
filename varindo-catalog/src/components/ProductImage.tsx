'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProductImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-stone-100 p-8 text-center text-sm font-medium text-stone-500">
        Product image will be updated soon
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
      className="object-cover transition duration-500 group-hover:scale-[1.045]"
      onError={() => setFailed(true)}
    />
  );
}
