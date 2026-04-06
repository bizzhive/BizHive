import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Star, TrendingUp } from "lucide-react";
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

  const ribbonTestimonials = useMemo(() => [...testimonials.slice(0, 10), ...testimonials.slice(0, 10)], [testimonials]);

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="India-first founder workspace"
          title="Plan smarter, launch faster, and grow with more confidence."
          description="From a tech startup to a neighborhood store, BizHive brings planning, launch readiness, compliance, documents, learning, incubators, and Bee AI into one clean operating system."
          actions={
            <>
              <Button asChild size="lg" className="h-11 rounded-2xl px-5">
                <Link to="/dashboard">
                  Open workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="glass-button h-11">
                <Link to="/tools">Explore tools</Link>
              </Button>
              <PremiumModal
                trigger={
                  <Button variant="ghost" size="lg" className="glass-button h-11">
                    Preview Premium
                  </Button>
                }
              />
            </>
          }
          visual={<ClayGraphic className="h-full min-h-[300px] xl:min-h-[400px]" variant="default" />}
        />

        <section className="soft-grid">
          <MetricTile label="Available languages" value="7" hint="English, Hindi, Gujarati, Kannada, Telugu, Marathi, and Tamil." />
          <MetricTile label="Core founder tools" value="7+" hint="Business canvas, market research, financials, pitch prep, planning, and legal workflows." />
          <MetricTile label="Free learning chapters" value="45+" hint="Fifteen chapters each across Plan, Launch, and Grow." />
          <MetricTile label="Bee modes" value="2" hint="Use Bee AI from the nav as a full workspace or from the right-side copilot." />
        </section>

        <section className="split-stage">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="What you can do here"
              title="The main product features, shown clearly"
              description="Every major capability lives on the home page so new users can understand the value before they start clicking around."
            />
            <div className="feature-rail">
              {heroFeatureSpotlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </Link>
                );
              })}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Choose your path"
              title="Start where your business is right now"
              description="The platform stays easier to navigate when the major paths are obvious from the beginning."
            />
            <div className="grid gap-3">
              {workspaceHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted card-lift flex items-start gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.title}</div>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Surface>
        </section>

        <section className="three-up">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Founder tool stack"
              title="Use real tools, not placeholder widgets"
              description="Every tool is meant to save work, reopen later, and support Bee-assisted guidance when needed."
            />
            <div className="grid gap-3">
              {toolSpotlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.href} className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65">
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
              eyebrow="Founder outcomes"
              title="Why people stay inside BizHive"
              description="The product is built to reduce switching, guesswork, and incomplete workflows."
            />
            <div className="grid gap-3">
              {[
                "Plan, launch, and grow inside one connected product.",
                "Reuse saved drafts, legal documents, and tool outputs instead of starting over.",
                "Switch between seven Indian-language UI modes without changing authored blogs or community posts.",
                "Use Bee AI for route-aware founder help without losing your conversation history.",
              ].map((item) => (
                <div key={item} className="panel-muted flex items-start gap-3 p-4">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <ClayGraphic className="h-full min-h-[360px]" variant="ai" compact />
          </Surface>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Founder voices"
            title="A rotating ribbon of real product feedback"
            description="Testimonials stay visible on the homepage so the product feels active, social, and alive."
          />

          {featuredTestimonial ? (
            <Surface className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr] xl:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: featuredTestimonial.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                  "{featuredTestimonial.feedback}"
                </div>
                <div className="text-sm text-muted-foreground">
                  {featuredTestimonial.display_name} · {featuredTestimonial.profession}
                </div>
              </div>

              <div className="compact-scroll overflow-x-auto pb-2">
                <div className="ribbon-track ribbon-marquee">
                  {ribbonTestimonials.map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      type="button"
                      onClick={() => setActiveTestimonial(index % Math.max(testimonials.length, 1))}
                      className="panel-muted min-w-[260px] p-4 text-left transition-colors hover:bg-accent/65"
                    >
                      <div className="text-sm font-semibold text-foreground">{item.display_name}</div>
                      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.profession}</div>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.feedback}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Surface>
          ) : null}
        </section>

        <section className="split-stage">
          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Official knowledge sources"
              title="Grounded in trusted public references"
              description="BizHive points founders toward public, reusable, India-relevant sources for compliance, registration, taxation, and startup support."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {officialKnowledgeSources.map((source) => (
                <a
                  key={source.title}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65"
                >
                  <div className="font-semibold text-foreground">{source.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{source.body}</p>
                </a>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-4">
            <SectionHeading
              eyebrow="Latest founder reading"
              title="Public blogs stay visible without signup friction"
              description="New users should be able to read, learn, and understand the product before they commit."
            />
            <div className="grid gap-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{post.category}</div>
                  <div className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                    {post.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                </Link>
              ))}

              <div className="panel-muted flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/12 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Ready to go deeper?</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Open the workspace, choose your current path, and keep your tool outputs, learning progress, and documents in one place.
                  </p>
                  <Button asChild className="mt-4 h-10 rounded-2xl px-4">
                    <Link to="/dashboard">Enter BizHive</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Surface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Index;

