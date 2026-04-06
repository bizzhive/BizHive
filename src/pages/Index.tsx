import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PremiumModal } from "@/components/PremiumModal";
import {
  heroFeatureSpotlights,
  officialKnowledgeSources,
  toolSpotlights,
  workspaceHighlights,
} from "@/content/product";
import { getPublishedBlogs } from "@/services/site-content";
import { getPublicTestimonials, type FeedbackEntry } from "@/services/feedback";
import { MetricTile, PageHeader, SectionHeading, SiteContainer, Surface } from "@/components/site/SitePrimitives";

const Index = () => {
  const [latestPosts, setLatestPosts] = useState<Array<{ slug: string; title: string; excerpt: string; category: string }>>([]);
  const [testimonials, setTestimonials] = useState<FeedbackEntry[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    document.title = "BizHive | Founder operating system";
    void getPublishedBlogs().then((posts) =>
      setLatestPosts(posts.slice(0, 3).map(({ slug, title, excerpt, category }) => ({ slug, title, excerpt, category })))
    );
    void getPublicTestimonials().then(setTestimonials);
  }, []);

  useEffect(() => {
    if (!testimonials.length) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const featuredTestimonial = useMemo(
    () => testimonials[activeTestimonial] ?? testimonials[0] ?? null,
    [activeTestimonial, testimonials]
  );

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="For every founder, shop owner, student builder, and operator"
          title="From a tech startup to a neighborhood store, no business should feel unscalable."
          description="BizHive is your one founder operating system for planning, launch, growth, compliance, documents, learning, and AI-guided work. The product is built to feel compact, visible, and useful from the first screen."
          actions={
            <>
              <Button asChild size="lg" className="h-12 rounded-2xl px-5">
                <Link to="/dashboard">
                  Open workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="glass-button h-12">
                <Link to="/ai-assistant">Open Bee AI</Link>
              </Button>
              <PremiumModal
                trigger={
                  <Button variant="ghost" size="lg" className="glass-button h-12">
                    Preview Premium
                  </Button>
                }
              />
            </>
          }
          visual={<ClayGraphic className="h-full min-h-[260px]" />}
        />

        <section className="hero-grid">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Everything visible up front"
              title="Core product surfaces"
              description="The homepage should explain the product in one pass: where to begin, what gets saved, what Bee does, and where each major path leads."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {workspaceHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted group p-4 transition-transform hover:-translate-y-0.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Surface>

          <div className="grid gap-4">
            <MetricTile label="Available languages" value="7" hint="English, Hindi, Gujarati, Kannada, Telugu, Marathi, and Tamil." />
            <MetricTile label="Core founder tools" value="7+" hint="Canvas, SWOT, startup math, financials, pitch prep, market research, and business planning." />
            <MetricTile label="Learning chapters" value="45+" hint="Fifteen chapters each across Plan, Launch, and Grow, all free to access." />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Featured capabilities"
              title="Bee, pitching, documents, signatures, and regional language access"
              description="These are the things users should immediately understand from the home page before anyone asks them to hunt through navigation."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {heroFeatureSpotlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted p-4 transition-colors hover:bg-accent/65">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold text-foreground">{item.title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </Link>
                );
              })}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Knowledge sources"
              title="Grounded in official and publicly available references"
              description="BizHive uses public founder knowledge, official portals, and reusable preparation resources so users know where the information is coming from."
            />
            <div className="grid gap-3">
              {officialKnowledgeSources.map((source) => (
                <a
                  key={source.title}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="panel-muted p-4 transition-colors hover:bg-accent/65"
                >
                  <div className="font-semibold text-foreground">{source.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{source.body}</p>
                </a>
              ))}
            </div>
          </Surface>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface className="space-y-4 overflow-hidden">
            <SectionHeading
              eyebrow="Rotating founder feedback"
              title="People should instantly feel where they are and what to do next"
              description="Testimonials rotate from seeded sample feedback and future user submissions from the footer widget."
            />

            {featuredTestimonial ? (
              <div className="rounded-[26px] border border-primary/20 bg-primary/[0.08] p-5">
                <div className="mb-3 flex items-center gap-1 text-primary">
                  {Array.from({ length: featuredTestimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  "{featuredTestimonial.feedback}"
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  {featuredTestimonial.display_name} · {featuredTestimonial.profession}
                </div>
              </div>
            ) : null}

            <div className="compact-scroll flex gap-3 overflow-x-auto pb-1">
              {testimonials.slice(0, 12).map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`min-w-[260px] rounded-[24px] border p-4 text-left transition-colors ${
                    activeTestimonial === index ? "border-primary/30 bg-primary/[0.08]" : "border-border/70 bg-muted/40"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">{item.display_name}</div>
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.profession}</div>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.feedback}</p>
                </button>
              ))}
            </div>
          </Surface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <SectionHeading
                eyebrow="Founder toolkit"
                title="Tools and workflows users will actually return to"
                description="The rebuild makes tools saveable, Bee-assisted, and easier to reopen from the dashboard."
              />
              <div className="grid gap-3">
                {toolSpotlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.id} to={item.href} className="panel-muted p-4 transition-colors hover:bg-accent/65">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/12 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="font-semibold text-foreground">{item.title}</div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </Link>
                  );
                })}
              </div>
            </Surface>

            <Surface className="space-y-4">
              <SectionHeading
                eyebrow="Latest reading"
                title="Published founder content stays visible"
                description="Blogs remain public and readable so new users can understand the product and the founder education layer before signing in."
              />
              <div className="grid gap-3">
                {latestPosts.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="panel-muted p-4 transition-colors hover:bg-accent/65">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{post.category}</div>
                    <div className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {post.title}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Index;

