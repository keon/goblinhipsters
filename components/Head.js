import HEAD from "next/head";

export default function Head() {
  return (
    <HEAD>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
      />

      {/* <!-- Primary Meta Tags --> */}
      <title>GOBLIN HIPSTERS</title>
      <meta name="title" content="GOBLIN HIPSTERS" />
      <meta name="description" content="grrragargrrrrrgrrrrrA......" />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://goblinhipsters.wtf" />
      <meta property="og:title" content="GOBLIN HIPSTERS" />
      <meta property="og:description" content="grrragargrrrrrgrrrrrA......" />
      <meta property="og:image" content="https://goblinhipsters.wtf/og.png" />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://goblinhipsters.wtf" />
      <meta property="twitter:title" content="GOBLIN HIPSTERS" />
      <meta
        property="twitter:description"
        content="grrragargrrrrrgrrrrrA......"
      />
      <meta
        property="twitter:image"
        content="https://goblinhipsters.wtf/og.png"
      />

      {/* <!-- Favicons --> */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#64ffa1" />
      <meta name="theme-color" content="#64ffa1" />
    </HEAD>
  );
}
