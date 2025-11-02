import Document, { Html, Head, Main, NextScript } from "next/document";
import { GTM_TRACKING_ID } from "config";

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en-us">
        <Head>
          <meta charSet="UTF-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#fff" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          ></meta>
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          {GTM_TRACKING_ID ? (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_TRACKING_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
              }}
            />
          ) : null}
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
