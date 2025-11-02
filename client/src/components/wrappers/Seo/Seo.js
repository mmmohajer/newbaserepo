import Head from "next/head";

const Seo = ({
  title = "PAGE_TITLE",
  keywords = "PAGE_KEYWORDS",
  description = "PAGE_DESCRIPTION",
  imagePreview = "PAGE_IMAGE_PREVIEW",
  url = "PAGE_URL",
  imgAlt = "PAGE_IMAGE_ALT",
  hidden_to_search_engines = false,
  structuredData = {},
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`${keywords}, Tech Tips, Tech Tips By Moh`}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tech Tips By Moh" />
        <meta name="twitter:card" content={imgAlt || title} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:url" content={url} />
        {hidden_to_search_engines ? (
          <meta name="robots" content="noindex,nofollow,noarchive" />
        ) : (
          ""
        )}
        {Object.keys(structuredData)?.length ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        ) : (
          ""
        )}
      </Head>
      {children}
    </>
  );
};

export default Seo;
