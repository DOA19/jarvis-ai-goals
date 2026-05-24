'use client';

import { useEffect, useState } from 'react';
import { getCountdown } from '@/lib/countdown';

export function useCountdown() {
  const [countdown, setCountdown] = useState(() => getCountdown());

  useEffect(() => {
    const id = window.setInterval(() => setCountdown(getCountdown()), 60_000);
    setCountdown(getCountdown());
    return () => window.clearInterval(id);
  }, []);

  return countdown;
}
