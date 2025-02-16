import Head from 'next/head';

interface CustomHeadProps {
  title: string;
  withViewport?: boolean;
}

export default function CustomHead({
  title,
  withViewport = false
}: CustomHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      {withViewport && (
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </>
      )}
    </Head>
  );
}