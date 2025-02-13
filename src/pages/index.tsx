import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Snapsum</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-black safe-top safe-bottom">
        <Image
          src="/assets/logos/logo.svg"
          alt="Logo"
          width={600}
          height={600}
          priority
          className="w-full max-w-[600px] h-auto px-4"
        />
      </div>
    </>
  );
}