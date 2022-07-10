import { useRouter } from 'next/router';

export default function useRefresher(): () => void {
  const router = useRouter();
  return () => router.replace(router.asPath);
}
