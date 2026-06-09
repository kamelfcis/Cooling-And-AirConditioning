import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { ReviewDialog } from '@/components/ReviewDialog';
import { ServiceRequest, ServiceStatus } from '@/lib/supabaseClient';

type StatusFilter = 'all' | ServiceStatus;

const STATUS_ORDER: ServiceStatus[] = ['pending', 'on_the_way', 'in_progress', 'completed'];

function statusAccent(status: string) {
  switch (status) {
    case 'completed':
      return 'border-s-emerald-500 bg-gradient-to-br from-emerald-50/80 to-card dark:from-emerald-950/20';
    case 'in_progress':
      return 'border-s-violet-500 bg-gradient-to-br from-violet-50/80 to-card dark:from-violet-950/20';
    case 'on_the_way':
      return 'border-s-sky-500 bg-gradient-to-br from-sky-50/80 to-card dark:from-sky-950/20';
    default:
      return 'border-s-amber-500 bg-gradient-to-br from-amber-50/80 to-card dark:from-amber-950/20';
  }
}

function StatusIcon({ status }: { status: string }) {
  const common = 'h-5 w-5 shrink-0';
  switch (status) {
    case 'completed':
      return <CheckCircle2 className={cn(common, 'text-emerald-600')} />;
    case 'in_progress':
      return <Wrench className={cn(common, 'text-violet-600')} />;
    case 'on_the_way':
      return <MapPin className={cn(common, 'text-sky-600')} />;
    default:
      return <Clock className={cn(common, 'text-amber-600')} />;
  }
}

export function CustomerRequests() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const { requests, isLoading } = useServiceRequests();
  const [reviewRequest, setReviewRequest] = useState<ServiceRequest | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const active = requests.filter((r) => r.status === 'on_the_way' || r.status === 'in_progress').length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    return { total, pending, active, completed };
  }, [requests]);

  const filtered = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'on_the_way':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh]">
        <div className="relative overflow-hidden border-b bg-gradient-to-br from-sky-100/80 via-background to-cyan-100/40">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="container relative mx-auto max-w-5xl px-4 py-16">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-muted/80" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl border bg-card/60" />
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl space-y-4 px-4 py-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-sky-100/90 via-background to-cyan-100/50">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,hsl(var(--primary)/0.03)_50%,transparent_100%)]" />

        <div className="container relative mx-auto max-w-5xl px-4 py-14 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                <span>{t('requests.title')}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  {t('requests.myRequests')}
                </h1>
                <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
                  {t('requests.heroSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border bg-background/70 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>
                <span className="font-semibold text-foreground">{stats.total}</span>
                <span className="mx-1.5 text-border">|</span>
                <span>{t('requests.statTotal')}</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('requests.statTotal'), value: stats.total, icon: ClipboardList, tone: 'from-slate-500/10 to-card' },
              { label: t('requests.statPending'), value: stats.pending, icon: Clock, tone: 'from-amber-500/15 to-card' },
              { label: t('requests.statActive'), value: stats.active, icon: Wrench, tone: 'from-violet-500/15 to-card' },
              { label: t('requests.statCompleted'), value: stats.completed, icon: CheckCircle2, tone: 'from-emerald-500/15 to-card' },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className={cn(
                  'rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition hover:shadow-md',
                  tone,
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 shadow-inner">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          {requests.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              <Button
                type="button"
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full px-5"
                onClick={() => setFilter('all')}
              >
                {t('requests.filterAll')}
              </Button>
              {STATUS_ORDER.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={filter === s ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full px-5"
                  onClick={() => setFilter(s)}
                >
                  {t(`status.${s}`)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
        {requests.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border bg-card p-10 text-center shadow-lg md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 shadow-inner ring-1 ring-primary/10">
                <ClipboardList className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{t('requests.emptyTitle')}</h2>
              <p className="mt-3 text-muted-foreground">{t('requests.emptySubtitle')}</p>
              <Button asChild className="mt-8 rounded-full px-8" size="lg">
                <Link to="/">{t('requests.browseServices')}</Link>
              </Button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border bg-card p-10 text-center shadow-md">
            <p className="text-muted-foreground">{t('requests.noRequests')}</p>
            <Button type="button" variant="outline" className="mt-4 rounded-full" onClick={() => setFilter('all')}>
              {t('requests.filterAll')}
            </Button>
          </div>
        ) : (
          <ul className="space-y-5">
            {filtered.map((request, index) => {
              const serviceName =
                i18n.language === 'ar' ? request.service?.name_ar : request.service?.name_en;

              return (
                <li
                  key={request.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                >
                  <article
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border border-s-4 bg-card shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl',
                      statusAccent(request.status),
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="p-6 md:p-7">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background/90 shadow-sm ring-1 ring-border/60">
                            <StatusIcon status={request.status} />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <h2 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
                              {serviceName}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {t('requests.acCount')}:{' '}
                              <span className="font-medium text-foreground">{request.ac_count}</span>
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(request.status)}
                          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm"
                        >
                          {t(`status.${request.status}`)}
                        </Badge>
                      </div>

                      <div className="mt-6 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-2">
                        <div className="flex gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/40">
                          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {t('requests.preferredDateTime')}
                            </p>
                            <p className="mt-1 text-sm font-medium leading-snug">
                              {formatDateTime(request.preferred_datetime, locale)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/40">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                            EGP
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {t('requests.estimatedPrice')}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatCurrency(request.estimated_price, locale)}
                            </p>
                            {request.final_price != null && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {t('requests.finalPrice')}:{' '}
                                <span className="font-bold text-primary">
                                  {formatCurrency(request.final_price, locale)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                        {request.engineer?.user && (
                          <div className="flex gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/40 sm:col-span-2">
                            <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {t('requests.engineer')}
                              </p>
                              <p className="mt-1 text-sm font-medium">{request.engineer.user.name}</p>
                            </div>
                          </div>
                        )}
                        {request.notes && (
                          <div className="rounded-xl bg-muted/40 p-4 sm:col-span-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {t('requests.notes')}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{request.notes}</p>
                          </div>
                        )}
                      </div>

                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          className="mt-6 w-full rounded-xl border-primary/30 bg-primary/5 font-semibold text-primary hover:bg-primary/10 sm:w-auto"
                          onClick={() => setReviewRequest(request)}
                        >
                          {t('reviews.rateEngineer')}
                        </Button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {reviewRequest && (
        <ReviewDialog
          request={reviewRequest}
          open={!!reviewRequest}
          onOpenChange={(open) => !open && setReviewRequest(null)}
        />
      )}
    </div>
  );
}
