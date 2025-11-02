const axios = require("axios");

const siteUrl = "https://tipsbymoh.tech";

function escapeXml(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeForXmlAttr(str) {
  return str.replace(/&(?!amp;)/g, "&amp;");
}

function isValidSlug(slug) {
  return (
    typeof slug === "string" &&
    !slug.includes("[") &&
    !slug.includes("]") &&
    slug.length > 2
  );
}

function buildImageEntry(preview_photo, title) {
  if (
    !preview_photo ||
    typeof preview_photo !== "string" ||
    preview_photo.trim().toLowerCase() === "undefined"
  ) {
    return undefined;
  }
  return [
    {
      loc: { href: escapeForXmlAttr(preview_photo.trim()) },
      title: escapeXml(title || "Preview Image"),
    },
  ];
}

async function fetchAndMapContent({ apiPath, routePrefix, key }) {
  try {
    const res = await axios.get(`${siteUrl}/api/${apiPath}/`);
    const items = res.data?.[key] || [];

    return items
      .filter((item) => isValidSlug(item.slug))
      .map((item) => {
        const imageEntry = buildImageEntry(item.preview_photo, item.title);
        return {
          loc: `${siteUrl}/${routePrefix}/${item.slug}`,
          lastmod: new Date(item.updated_at).toISOString(),
          changefreq: "daily",
          priority: 0.7,
          ...(imageEntry ? { images: imageEntry } : {}),
        };
      });
  } catch (err) {
    console.error(`❌ Failed to fetch ${apiPath}:`, err.message);
    return [];
  }
}

async function fetchAndMapCourses() {
  try {
    const res = await axios.get(`${siteUrl}/api/courses/`);
    const products = res.data || [];

    return products
      .filter((product) => product.course && isValidSlug(product.course.slug))
      .map((product) => {
        const course = product.course;
        const imageEntry = buildImageEntry(
          course.preview_image_url,
          course.title
        );
        return {
          loc: `${siteUrl}/courses/${course.slug}`,
          lastmod: new Date(course.updated_at).toISOString(),
          changefreq: "daily",
          priority: 0.7,
          ...(imageEntry ? { images: imageEntry } : {}),
        };
      });
  } catch (err) {
    console.error(`❌ Failed to fetch courses:`, err.message);
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/admin*", "/api/*", "/app/*", "/_next/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  additionalPaths: async () => {
    const [blogs, projects, tips, courses] = await Promise.all([
      fetchAndMapContent({
        apiPath: "blogs",
        routePrefix: "blog",
        key: "blogs",
      }),
      fetchAndMapContent({
        apiPath: "projects",
        routePrefix: "projects",
        key: "projects",
      }),
      fetchAndMapContent({ apiPath: "tips", routePrefix: "tips", key: "tips" }),
      fetchAndMapCourses(),
    ]);

    const all = [...blogs, ...projects, ...tips, ...courses];
    return all;
  },
};
