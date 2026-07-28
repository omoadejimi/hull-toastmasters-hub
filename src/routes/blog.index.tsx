import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POSTS } from "@/data/club";

const TITLE = "Blog | Hull Toastmasters";
const DESCRIPTION =
  "Practical articles from Hull Toastmasters members on public speaking, beating nerves, leadership and the Toastmasters Pathways programme.";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">Club blog</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Speaking tips, member stories and news from Hull Toastmasters.
      </p>
      <ul className="mt-10 space-y-6">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Card className="card-elevated">
              <CardHeader>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>{" "}
                  · {p.author} · {p.readingTime}
                </p>
                <CardTitle className="text-xl">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-primary hover:underline"
                  >
                    {p.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.excerpt}</CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}