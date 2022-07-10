import App, { AppContext } from 'next/app';
import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'regenerator-runtime/runtime';

import '@/styles/globals.css';

import AppContextProvider, { Context, getUser } from '../context/authContext';

const queryClient = new QueryClient();

const NextApp = ({
  Component,
  pageProps,
  auth,
}: {
  // eslint-disable-next-line
  Component: FC<any>;
  pageProps: { children: ReactNode };
  auth: Context['auth'];
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider auth={auth}>
        <Component {...pageProps} />
      </AppContextProvider>
    </QueryClientProvider>
  );
};

// Retrieve application context (user and props)
NextApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const auth = await getUser(appContext.ctx);
  return { ...appProps, auth: auth };
};

export default NextApp;
