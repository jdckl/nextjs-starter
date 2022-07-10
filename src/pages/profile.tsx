import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function Profile() {
  return (
    <Layout>
      <Seo
        templateTitle='Profile'
        template={{
          description: 'Edit your profile information.',
        }}
      />
      <Seo />

      <main className='min-h-[100%] w-full flex-grow overflow-y-scroll bg-white p-8'></main>
    </Layout>
  );
}
