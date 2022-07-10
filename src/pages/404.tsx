import * as React from 'react';
import { VscInfo } from 'react-icons/vsc';

import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='Not Found' />

      <main className='h-[calc(100vh-81px)] w-full overflow-y-hidden bg-white p-8'>
        <div className='layout flex h-full flex-col items-center justify-center text-center text-black'>
          <VscInfo size={60} className='text-red-500' />
          <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
          <ButtonLink href='/' className='mt-10'>
            Return home
          </ButtonLink>
        </div>
      </main>
    </Layout>
  );
}
