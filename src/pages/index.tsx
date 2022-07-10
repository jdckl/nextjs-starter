import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      <Seo
        templateTitle='Home'
        template={{
          description: 'Description of your site.',
        }}
      />
      <Seo />

      <main className='h-full w-full flex-grow overflow-y-hidden bg-white p-8'>
        Page content goes here :)
      </main>
    </Layout>
  );
}
