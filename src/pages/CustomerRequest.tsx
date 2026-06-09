import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  Minus,
  Plus,
  Sparkles,
  Wrench,
} from 'lucide-react';

const requestSchema = z.object({
  serviceId: z.string().min(1, 'validation.required'),
  acCount: z.number().min(1, 'validation.acCountMin'),
  preferredDate: z.string().min(1, 'validation.required'),
  preferredTime: z.string().min(1, 'validation.required'),
  notes: z.string().optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

export function CustomerRequest() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: services, isLoading } = useServices();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      serviceId: '',
      acCount: 1,
      preferredDate: '',
      preferredTime: '',
      notes: '',
    },
  });

  const serviceId = watch('serviceId');
  const acCount = watch('acCount') || 1;

  useEffect(() => {
    const serviceIdParam = searchParams.get('serviceId');
    if (serviceIdParam) {
      setValue('serviceId', serviceIdParam);
      setSelectedService(serviceIdParam);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [serviceId]);

  const selectedServiceData = services?.find((s) => s.id === selectedService);
  const estimatedPrice = selectedServiceData ? selectedServiceData.base_price * acCount : 0;

  const setAcCount = (n: number) => {
    const next = Math.min(50, Math.max(1, n));
    setValue('acCount', next, { shouldValidate: true });
  };

  const onSubmit = async (data: RequestForm) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedServiceData) {
      showToast({
        title: t('common.error'),
        description: t('services.selectService'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const preferredDateTime = dayjs(`${data.preferredDate} ${data.preferredTime}`).toISOString();

      const { error } = await supabase.from('service_requests').insert({
        customer_id: user.id,
        service_id: data.serviceId,
        ac_count: data.acCount,
        preferred_datetime: preferredDateTime,
        estimated_price: estimatedPrice,
        notes: data.notes,
        status: 'pending',
      });

      if (error) throw error;

      showToast({
        title: t('common.success'),
        description: t('services.requestCreated'),
      });

      navigate('/requests');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.error');
      showToast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        <div className="container relative mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-10 w-10 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{t('auth.login')}</h1>
          <p className="mt-4 text-slate-300">{t('auth.loginRequiredBody')}</p>
          <Button
            size="lg"
            className="mt-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-10 font-semibold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95"
            onClick={() => navigate('/login')}
          >
            {t('nav.login')}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.06)_50%,transparent_70%)] [animation-duration:2s]" />
          <div className="container relative mx-auto max-w-5xl px-4 py-16">
            <div className="h-8 w-48 rounded-lg bg-white/10" />
            <div className="mt-4 h-4 w-96 max-w-full rounded bg-white/10" />
          </div>
        </div>
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="h-80 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
            <div className="h-96 animate-pulse rounded-3xl bg-muted lg:col-span-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top hero bar */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-90" />

        <div className="container relative mx-auto max-w-5xl px-4 py-12 md:py-14">
          <Button
            type="button"
            variant="ghost"
            className="mb-6 -ms-2 gap-2 text-white/90 hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('nav.home')}
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cyan-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {t('services.title')}
          </div>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {t('services.createRequest')}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">{t('services.requestHeroSubtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Summary column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-1 shadow-xl">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />
              <div className="rounded-[1.35rem] bg-gradient-to-b from-muted/40 to-card p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t('services.sectionService')}
                </p>
                {selectedServiceData ? (
                  <>
                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-600 text-primary-foreground shadow-lg">
                        <Wrench className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold leading-tight md:text-2xl">
                          {i18n.language === 'ar'
                            ? selectedServiceData.name_ar
                            : selectedServiceData.name_en}
                        </h2>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">{selectedServiceData.code}</p>
                      </div>
                    </div>
                    {(selectedServiceData.description_en || selectedServiceData.description_ar) && (
                      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                        {i18n.language === 'ar'
                          ? selectedServiceData.description_ar || selectedServiceData.description_en
                          : selectedServiceData.description_en || selectedServiceData.description_ar}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">{t('services.selectService')}</p>
                )}

                {selectedServiceData && (
                  <div className="mt-8 space-y-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-cyan-500/5 p-5 shadow-inner">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t('services.priceBreakdown')}
                    </p>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(selectedServiceData.base_price, locale)} × {acCount}
                      </span>
                      <span className="text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                        {formatCurrency(estimatedPrice, locale)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t('services.estimatedPrice')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form column */}
          <Card className="relative overflow-hidden border-0 shadow-2xl ring-1 ring-border/50 lg:col-span-3">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <CardHeader className="space-y-1 border-b bg-muted/30 px-6 py-6 md:px-8">
              <CardTitle className="text-xl md:text-2xl">{t('services.createRequest')}</CardTitle>
              <CardDescription className="text-base">{t('services.requestHeroSubtitle')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-8 px-6 py-8 md:px-8">
                <input type="hidden" {...register('serviceId')} />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">{t('services.selectService')}</Label>
                  <Select
                    value={selectedService}
                    onValueChange={(value) => {
                      setValue('serviceId', value);
                      setSelectedService(value);
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 bg-background/80 shadow-sm transition hover:border-primary/40">
                      <SelectValue placeholder={t('services.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {i18n.language === 'ar' ? service.name_ar : service.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceId && (
                    <p className="text-sm text-destructive">{t(errors.serviceId.message || 'validation.required')}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold">{t('services.acCount')}</Label>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border-2 bg-muted/30 p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 shrink-0 rounded-xl border bg-background shadow-sm hover:bg-muted"
                      onClick={() => setAcCount(acCount - 1)}
                      disabled={acCount <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-1 flex-col items-center justify-center py-2">
                      <span className="text-4xl font-bold tabular-nums tracking-tight">{acCount}</span>
                      <span className="text-xs font-medium uppercase text-muted-foreground">{t('services.perUnit')}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 shrink-0 rounded-xl border bg-background shadow-sm hover:bg-muted"
                      onClick={() => setAcCount(acCount + 1)}
                      disabled={acCount >= 50}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  {errors.acCount && (
                    <p className="text-sm text-destructive">{t(errors.acCount.message || 'validation.required')}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t('services.sectionSchedule')}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="preferredDate" className="flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {t('services.preferredDate')}
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        min={dayjs().format('YYYY-MM-DD')}
                        className="h-12 rounded-xl border-2 bg-background/80 shadow-sm"
                        {...register('preferredDate')}
                      />
                      {errors.preferredDate && (
                        <p className="text-sm text-destructive">
                          {t(errors.preferredDate.message || 'validation.required')}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime" className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        {t('services.preferredTime')}
                      </Label>
                      <Input
                        id="preferredTime"
                        type="time"
                        className="h-12 rounded-xl border-2 bg-background/80 shadow-sm"
                        {...register('preferredTime')}
                      />
                      {errors.preferredTime && (
                        <p className="text-sm text-destructive">
                          {t(errors.preferredTime.message || 'validation.required')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    {t('services.sectionNotes')}
                  </Label>
                  <Textarea
                    id="notes"
                    rows={5}
                    placeholder={t('services.notes')}
                    className="min-h-[120px] resize-none rounded-2xl border-2 bg-background/80 text-base shadow-sm"
                    {...register('notes')}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary via-cyan-600 to-teal-600 text-base font-semibold shadow-lg shadow-primary/25 transition hover:opacity-[0.98] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="me-2 h-5 w-5" />
                      {t('services.createRequest')}
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
