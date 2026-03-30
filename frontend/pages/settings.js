import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  useEffect(() => { router.replace('/profile'); }, []);
  return null;
}
