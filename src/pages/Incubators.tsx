import { useMemo, useState } from "react";
import { Building2, Filter, HandCoins, MapPin, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import incubatorsData from "@/data/incubators.json";

type IncubatorRecord = (typeof incubatorsData.incubators)[number];

const fixText = (value: string) => value.replaceAll("â‚¹", "₹");

const Incubators = () => {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All states");
  const [typeFilter, setTypeFilter] = useState("All types");

  const states = useMemo(
    () => ["All states", ...Array.from(new Set(incubatorsData.incubators.map((item) => item.state)))],
    []
  );
  const types = useMemo(
    () => ["All types", ...Array.from(new Set(incubatorsData.incubators.map((item) => item.type)))],
    []
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return incubatorsData.incubators.filter((item) => {
      const matchesState = stateFilter === "All states" || item.state === stateFilter;
      const matchesType = typeFilter === "All types" || item.type === typeFilter;
      const haystack = [
        item.name,
        item.location,
        item.state,
        item.focus,
        item.description,
        item.type,
        item.industry.join(" "),
        item.stage.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return matchesState && matchesType && (!query || haystack.includes(query));
    });
  }, [search, stateFilter, typeFilter]);

  const topPicks = filtered.slice(0, 8) as IncubatorRecord[];

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Incubators and funding"
          title="Explore support, grants, incubators, and pitch readiness in one founder surface"
          description="Use the finder to shortlist relevant programs, compare focus areas, and keep investor-facing preparation close to the same workflow."
          icon={Building2}
          visual={<ClayGraphic className="h-full min-h-[320px] xl:min-h-[400px]" variant="network" />}
        />

        <section className="metrics-strip">
          <Surface className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Visible programs</div>
            <div className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{filtered.length}</div>
            <p className="text-sm leading-7 text-muted-foreground">The finder adapts live as you filter by state, type, and intent.</p>
          </Surface>
          <Surface className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">States covered</div>
            <div className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{states.length - 1}</div>
            <p className="text-sm leading-7 text-muted-foreground">Compare regional support instead of starting every search from scratch.</p>
          </Surface>
          <Surface className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Program types</div>
            <div className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{types.length - 1}</div>
            <p className="text-sm leading-7 text-muted-foreground">Mix government, private, university, and sector-focused options in one view.</p>
          </Surface>
          <Surface className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Pitch readiness</div>
            <div className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">Built in</div>
            <p className="text-sm leading-7 text-muted-foreground">Move from shortlist to deck refinement without leaving the product shell.</p>
          </Surface>
        </section>

        <section className="workspace-grid">
          <ScrollSurface className="xl:h-[calc(100vh-14rem)] xl:min-h-[56rem]">
            <div className="compact-scroll space-y-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_repeat(2,minmax(0,180px))]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by incubator, location, industry, or focus"
                    className="h-12 rounded-[22px] pl-11"
                  />
                </div>

                <select
                  value={stateFilter}
                  onChange={(event) => setStateFilter(event.target.value)}
                  className="h-12 rounded-[22px] border border-border/70 bg-card px-4 text-sm text-foreground"
                >
                  {states.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="h-12 rounded-[22px] border border-border/70 bg-card px-4 text-sm text-foreground"
                >
                  {types.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.map((item) => (
                  <a
                    key={`${item.name}-${item.location}`}
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    className="panel-muted card-lift p-4 transition-colors hover:bg-accent/65"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{item.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>{item.focus}</span>
                        </div>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {item.rating.toFixed(1)}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <HandCoins className="h-4 w-4" />
                        {fixText(item.funding)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.stage.map((stage) => (
                        <span key={stage} className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-foreground">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </ScrollSurface>

          <div className="grid gap-4">
            <Surface className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Directory health</div>
                  <div className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">{filtered.length}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/12 text-primary">
                  <Filter className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Use the filters to narrow by state and program type, then compare focus, stages, and funding range quickly.
              </p>
            </Surface>

            <ScrollSurface className="xl:h-[22rem]">
              <div className="compact-scroll space-y-3">
                <div className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">Top shortlisting picks</div>
                {topPicks.map((item) => (
                  <div key={`${item.name}-pick`} className="panel-muted p-4">
                    <div className="font-semibold text-foreground">{item.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.location} · {item.type}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{fixText(item.funding)}</div>
                  </div>
                ))}
              </div>
            </ScrollSurface>

            <Surface className="overflow-hidden">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px] xl:items-center">
                <div className="space-y-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Founder angle
                  </div>
                  <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    The incubator finder should feel like a real decision surface.
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Search is only useful when it stays close to your pitch, funding, and business stage. That is why this route now behaves more like a founder cockpit than a static directory page.
                  </p>
                </div>

                <ClayGraphic className="h-full min-h-[260px]" compact variant="network" />
              </div>
            </Surface>

            <Surface className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Pitch preparation checklist
              </div>
              <div className="grid gap-3">
                {[
                  "Define the first investor story in one sentence.",
                  "Prepare a metrics snapshot you can defend live.",
                  "Decide which program stage fits your business today.",
                  "Use Bee or the pitch deck builder to tighten the final narrative.",
                ].map((item) => (
                  <div key={item} className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button asChild className="rounded-2xl">
                  <Link to="/tools/pitch-deck-builder">Open pitch deck</Link>
                </Button>
                <Button asChild variant="ghost" className="glass-button">
                  <Link to="/ai-assistant">Ask Bee</Link>
                </Button>
              </div>
            </Surface>
          </div>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Incubators;
