import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Star, Wand2 } from "lucide-react";
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
          description="BizHive is your one founder operating system for planning, launch, growth, compliance, documents, learning, and AI-guided work. It is designed to feel vivid, spacious, and clear on big desktop screens instead of hiding the product inside cramped cards."
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
          visual={<ClayGraphic className="h-full min-h-[320px] xl:min-h-[430px]" variant="default" />}
        />

        <section className="feature-wall">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Everything visible up front"
              title="Core product surfaces"
              description="The homepage should explain the product in one pass: where to begin, what gets saved, what Bee does, and how BizHive turns scattered founder tasks into one operating system."
            />
            <div className="grid gap-4 xl:grid-cols-3">
              {workspaceHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted card-lift group p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-5 font-display text-[1.9rem] font-semibold tracking-[-0.05em] text-foreground">{item.title}</div>
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

          <div className="grid gap-5">
            <Surface className="overflow-hidden">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
                <div className="space-y-4">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Why the layout feels bigger now
                  </div>
                  <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    Visual depth, wider composition, and fewer dead zones.
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Instead of stacking one small card after another, BizHive now uses broader work stages, larger illustration anchors, and fuller desktop-width sections so the app feels premium instead of compressed.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Clay-style 3D graphics and soft motion for product personality.",
                      "Route sections that spread across large screens instead of shrinking into a center column.",
                      "Feature groupings that read as product stories, not just isolated cards.",
                      "A clearer desktop rhythm between content, illustrations, stats, and actions.",
                    ].map((item) => (
                      <div key={item} className="panel-muted flex items-start gap-3 p-4">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <ClayGraphic className="h-full min-h-[320px]" variant="tools" compact />
              </div>
            </Surface>

            <div className="metrics-strip">
            <MetricTile label="Available languages" value="7" hint="English, Hindi, Gujarati, Kannada, Telugu, Marathi, and Tamil." />
            <MetricTile label="Core founder tools" value="7+" hint="Canvas, SWOT, startup math, financials, pitch prep, market research, and business planning." />
            <MetricTile label="Learning chapters" value="45+" hint="Fifteen chapters each across Plan, Launch, and Grow, all free to access." />
              <MetricTile label="Bee surfaces" value="2" hint="Open Bee from the nav as a full workspace or from the bottom-right copilot." />
            </div>
          </div>
        </section>

        <section className="visual-balance-grid">
          <Surface className="space-y-5 overflow-hidden">
            <SectionHeading
              eyebrow="Featured capabilities"
              title="Bee, pitching, documents, signatures, and regional language access"
              description="These are the product stories users should understand before anyone asks them to hunt through navigation."
            />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-3 md:grid-cols-2">
              {heroFeatureSpotlights.map((item) => {
                const Icon = item.icon;
                return (
                    <Link key={item.id} to={item.href} className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65">
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

              <div className="hidden xl:block">
                <ClayGraphic className="h-full min-h-[420px]" variant="ai" compact />
              </div>
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

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
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

            <Surface className="overflow-hidden">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                <div className="space-y-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Wand2 className="h-3.5 w-3.5" />
                    Product atmosphere
                  </div>
                  <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    A founder product should feel alive, not like a spreadsheet site.
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    BizHive mixes practical workflows with motion, gradients, softer corners, and clay-style illustration so the interface feels welcoming to young founders without losing professional structure.
                  </p>
                </div>
                <ClayGraphic className="h-full min-h-[260px]" variant="workspace" compact />
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

