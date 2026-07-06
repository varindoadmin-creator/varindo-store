'use client';

import dynamic from 'next/dynamic';

// AiChat is a 300+ line widget with its own state/API calls that isn't needed for first paint
// on any page. Loading it via next/dynamic + ssr:false splits it into its own chunk that loads
// after hydration, instead of shipping with every route's First Load JS. `ssr: false` is only
// valid inside a Client Component, hence this thin wrapper around the server-rendered layout.
const AiChat = dynamic(() => import('./AiChat').then((mod) => mod.AiChat), { ssr: false });

export function AiChatLoader() {
  return <AiChat />;
}
