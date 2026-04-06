import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appFeatureGroups, testimonials } from "@/content/site";
import { getPublishedBlogs } from "@/services/site-content";
import { SiteContainer, Surface, PageHeader, SectionHeading, MetricTile } from "@/components/site/SitePrimitives";
import { useTranslation } from "react-i18next";

type HighlightCard = { body: string; title: string };

const Index = () => {
  const { t } = useTranslation();
  const [latestPosts, setLatestPosts] = useState<Array<{ slug: string; title: string; excerpt: string; category: string }>>([]);

  useEffect(() => {
    document.title = "BizHive | Founder Operating System";
    void getPublishedBlogs().then((posts) =>
      setLatestPosts(posts.slice(0, 3).map(({ slug, title, excerpt, category }) => ({ slug, title, excerpt, category })))
    );
  }, []);

  const featureCards = useMemo(
    () => t("home.featureCards", { returnObjects: true }) as HighlightCard[],
    [t]
  );
  const proofCards = useMemo(
    () => t("home.proofCards", { returnObjects: true }) as HighlightCard[],
    [t]
  );

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("home.hero.eyebrow")}
          title={t("home.hero.title")}
          description={t("home.hero.subtitle")}
          actions={
            <>
              <Button asChild size="lg" className="h-12 rounded-2xl px-5">
                <Link to="/dashboard">
                  {t("home.hero.ctaPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12 rounded-2xl border border-border/80 px-5">
                <Link to="/tools">{t("home.hero.ctaSecondary")}</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow={t("home.highlightTitle")}
              title={t("home.productMapTitle")}
              description={t("home.highlightBody")}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {featureCards.map((item) => (
                <div key={item.title} className="panel-muted p-4">
                  <div className="font-display text-lg font-semibold text-foreground">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("home.productMapTitle")}
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                {t("home.productMapBody")}
              </h2>
            </div>

            <div className="grid gap-3">
              {appFeatureGroups.map((group) => {
                const Icon = group.icon;
                return (
                  <Link
                    key={group.id}
                    to={group.href}
                    className="panel-muted flex items-start justify-between gap-4 p-4 transition-colors hover:bg-accent/70"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{t(`nav.${group.id === "library" ? "library" : group.id === "grow" ? "grow" : group.id}`)}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{group.stat}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </Surface>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Product proof"
              title="The rebuild is fixing structure, not decorating confusion."
              description="These are the UX corrections guiding the new system."
            />
            <div className="grid gap-3">
              {proofCards.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/35 p-4">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <div className="grid gap-5 md:grid-cols-3">
            <MetricTile label="Saved workflows" value="Documents + tools" hint="Critical founder work now routes back into the dashboard." />
            <MetricTile label="Public resources" value="Blogs + policies" hint="The product explains itself before asking people to sign in." />
            <MetricTile label="Testing readiness" value="Mobile first" hint="The new layout is designed to stay usable for live user testing." />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow={t("home.testimonialTitle")}
              title={t("home.testimonialBody")}
              description="These quotes reflect the feeling the rebuild is aiming for across navigation, saved state, and overall product confidence."
            />
            <div className="grid gap-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="rounded-2xl border border-border/80 bg-muted/35 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Quote className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-foreground">{testimonial.quote}</p>
                  <div className="mt-3">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <SectionHeading
              eyebrow={t("nav.blog")}
              title="Published content that is already visible"
              description="The blog library now always has real articles available, even while the live CMS content is being rebuilt."
            />
            <div className="grid gap-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="rounded-2xl border border-border/80 bg-muted/35 p-4 transition-colors hover:bg-accent/70">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{post.category}</div>
                  <div className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                    {post.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Index;
