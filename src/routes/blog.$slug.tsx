import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { POSTS } from "@/data/club";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  component: BlogPost,
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.title} | Hull Toastmasters` : "Blog | Hull Toastmasters";
    const description = loaderData?.excerpt ?? "An article from Hull Toastmasters.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.title,
                datePublished: loaderData.date,
                author: { "@type": "Person", name: loaderData.author },
                publisher: { "@type": "Organization", name: "Hull Toastmasters" },
              }),
            },
          ]
        : [],
    };
  },
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link to="/blog" className="text-primary hover:underline">
          ← Back to blog
        </Link>
      </nav>
      <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>{" "}
        · {post.author} · {post.readingTime}
      </p>
      <div className="mt-8 space-y-5 text-base leading-relaxed">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}