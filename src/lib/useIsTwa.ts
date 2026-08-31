'use client';

import { useEffect, useState } from 'react';

/**
 * True when the page was opened from the Varindo Android app (Trusted Web
 * Activity). Android sets document.referrer to "android-app://<package>"
 * for the initial navigation in a TWA — a normal browser visit never has
 * this referrer. Starts false on the server/first render to avoid a
 * hydration mismatch, then flips after mount if applicable.
 */
export function useIsTwa() {
  const [isTwa, setIsTwa] = useState(false);

  useEffect(() => {
    setIsTwa(document.referrer.startsWith('android-app://'));
  }, []);

  return isTwa;
}
