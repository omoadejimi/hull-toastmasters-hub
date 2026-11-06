// Configure the public origin at build time. Do not invent a production domain.
function siteUrl(path: string) {
  const configured = import.meta.env.VITE_SITE_URL;
  if (!configured) return undefined;
  try {
    const url = new URL(configured);
    if (!["https:", "http:"].includes(url.protocol)) return undefined;
    return new URL(path, url.origin).href;
  } catch {
    return undefined;
  }
}

export function canonicalLinks(path: string) {
  const href = siteUrl(path);
  return href ? [{ rel: "canonical", href }] : [];
}

export function socialMeta(path: string) {
  const url = siteUrl(path);
  const image = siteUrl("/social-preview.jpg");
  return [
    { name: "twitter:card", content: "summary_large_image" },
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(image
      ? [
          { property: "og:image", content: image },
          {
            property: "og:image:alt",
            content: "A speaker practising a presentation with an audience",
          },
          { name: "twitter:image", content: image },
        ]
      : []),
  ];
}
