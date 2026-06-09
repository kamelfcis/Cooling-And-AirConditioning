import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { ServiceRequest, Engineer, User } from '@/lib/supabaseClient';
import {
  Loader2,
  Users,
  FileText,
  DollarSign,
  Wrench,
  LayoutDashboard,
  Shield,
  Sparkles,
  Package,
  UserCog,
  ArrowRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
  const { requests, isLoading, assignEngineerAsync } = useServiceRequests();
  const { data: services } = useServices();
  const { showToast } = useToast();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  const { data: engineers, isLoading: engineersLoading } = useQuery({
    queryKey: ['engineers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engineers')
        .select(`
          *,
          user:users!engineers_user_id_fkey(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as (Engineer & { user: User })[];
    },
  });

  const totalRequests = requests.length;
  const completedJobs = requests.filter((r) => r.status === 'completed').length;
  const totalRevenue = requests
    .filter((r) => r.final_price)
    .reduce((sum, r) => sum + (r.final_price || 0), 0);
  const activeEngineers = engineers?.length || 0;
  const pendingAssign = requests.filter((r) => !r.engineer_id).length;

  const handleAssignEngineer = async () => {
    if (!selectedRequest || !selectedEngineerId) return;
    setAssigning(true);
    try {
      await assignEngineerAsync({
        requestId: selectedRequest.id,
        engineerId: selectedEngineerId,
      });
      showToast({
        title: t('common.success'),
        description: t('admin.assignEngineer'),
      });
      setAssignDialogOpen(false);
      setSelectedRequest(null);
      setSelectedEngineerId('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.error');
      showToast({
        title: t('common.error'),
        description: message,
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  const openAssignDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setSelectedEngineerId(request.engineer_id || '');
    setAssignDialogOpen(true);
  };

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
      <div className="min-h-screen bg-muted/30">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-violet-200/50 via-background to-cyan-200/40">
          <div className="absolute h-64 w-64 -right-20 -top-20 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div className="container relative mx-auto max-w-6xl px-4 py-16">
            <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-5 max-w-xl animate-pulse rounded bg-muted/80" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border bg-card/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statTiles = [
    {
      title: t('admin.totalRequests'),
      value: totalRequests,
      icon: FileText,
      gradient: 'from-sky-500/20 via-card to-card',
      iconBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    },
    {
      title: t('admin.completedJobs'),
      value: completedJobs,
      icon: Wrench,
      gradient: 'from-emerald-500/20 via-card to-card',
      iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    },
    {
      title: t('admin.totalRevenue'),
      value: formatCurrency(totalRevenue, locale),
      icon: DollarSign,
      gradient: 'from-amber-500/20 via-card to-card',
      iconBg: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
    },
    {
      title: t('admin.activeEngineers'),
      value: activeEngineers,
      icon: Users,
      gradient: 'from-violet-500/20 via-card to-card',
      iconBg: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-violet-200/80 via-background to-cyan-200/50 dark:from-violet-950/40 dark:via-background dark:to-cyan-950/30">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl [animation-duration:4s]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[28rem] w-[28rem] animate-pulse rounded-full bg-cyan-400/20 blur-3xl [animation-duration:5s]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-2xl" />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
                <Shield className="h-4 w-4" />
                <span>{t('roles.admin')}</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-600 text-primary-foreground shadow-lg shadow-primary/25">
                  <LayoutDashboard className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                    <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                      {t('admin.title')}
                    </span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                    {t('admin.heroSubtitle')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{pendingAssign}</p>
                  <p className="text-xs text-muted-foreground">{t('admin.unassigned')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statTiles.map(({ title, value, icon: Icon, gradient, iconBg }, i) => (
              <div
                key={title}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl',
                  gradient,
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,hsl(var(--primary)/0.08)_50%,transparent_60%)] opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight md:text-3xl">{value}</p>
                  </div>
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl shadow-inner transition group-hover:scale-110',
                      iconBg,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
        <Tabs defaultValue="requests" className="space-y-8">
          <div className="rounded-2xl border bg-card/80 p-2 shadow-lg backdrop-blur-sm">
            <TabsList className="grid h-auto w-full gap-2 bg-transparent p-0 sm:grid-cols-3">
              <TabsTrigger
                value="requests"
                className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <FileText className="me-2 h-4 w-4" />
                {t('admin.allRequests')}
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <Package className="me-2 h-4 w-4" />
                {t('admin.manageServices')}
              </TabsTrigger>
              <TabsTrigger
                value="engineers"
                className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-cyan-600 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <UserCog className="me-2 h-4 w-4" />
                {t('admin.manageEngineers')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="requests" className="mt-0 outline-none">
            <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-border/60">
              <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-cyan-500/10 to-violet-500/10 px-6 py-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('admin.allRequests')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">{t('requests.service')}</TableHead>
                        <TableHead className="font-semibold">{t('requests.customer')}</TableHead>
                        <TableHead className="font-semibold">{t('requests.acCount')}</TableHead>
                        <TableHead className="font-semibold">{t('requests.status')}</TableHead>
                        <TableHead className="font-semibold">{t('requests.estimatedPrice')}</TableHead>
                        <TableHead className="text-end font-semibold">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                            {t('requests.noRequests')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        requests.map((request, index) => {
                          const serviceName =
                            i18n.language === 'ar'
                              ? request.service?.name_ar
                              : request.service?.name_en;

                          return (
                            <TableRow
                              key={request.id}
                              className="animate-in fade-in border-border/60 transition-colors hover:bg-primary/[0.03]"
                              style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                            >
                              <TableCell className="font-medium">{serviceName}</TableCell>
                              <TableCell>{request.customer?.name ?? '—'}</TableCell>
                              <TableCell>{request.ac_count}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(request.status)}
                                  className="rounded-full px-2.5"
                                >
                                  {t(`status.${request.status}`)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium tabular-nums">
                                {formatCurrency(request.estimated_price, locale)}
                              </TableCell>
                              <TableCell className="text-end">
                                {!request.engineer_id ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-primary/40 bg-primary/5 font-semibold text-primary hover:bg-primary/15"
                                    onClick={() => openAssignDialog(request)}
                                  >
                                    {t('admin.assignEngineer')}
                                    <ArrowRight className="ms-1 h-3.5 w-3.5" />
                                  </Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    {request.engineer?.user?.name ?? '—'}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-0 outline-none">
            {!services || services.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground">
                {t('services.noServices')}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service, index) => {
                  const serviceName = i18n.language === 'ar' ? service.name_ar : service.name_en;
                  return (
                    <Card
                      key={service.id}
                      className="group overflow-hidden border-0 shadow-lg ring-1 ring-border/50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-primary/30"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-cyan-500 to-violet-500 transition group-hover:h-2" />
                      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-cyan-500/15 text-primary">
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg leading-tight">{serviceName}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatCurrency(service.base_price, locale)} {t('services.perUnit')}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={service.is_active ? 'default' : 'secondary'}
                          className="shrink-0 rounded-full"
                        >
                          {service.is_active ? t('admin.isActive') : 'Inactive'}
                        </Badge>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="engineers" className="mt-0 outline-none">
            {engineersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : !engineers || engineers.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-muted/30 py-16 text-center text-muted-foreground">
                {t('admin.noEngineers')}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {engineers.map((engineer, index) => (
                  <Card
                    key={engineer.id}
                    className="group overflow-hidden border-0 shadow-lg ring-1 ring-border/50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-violet-500/30"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-primary to-cyan-500 transition group-hover:h-2" />
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-primary/20 text-lg font-bold text-primary shadow-inner">
                          {engineer.user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{engineer.user.name}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {engineer.city}
                            {engineer.specialization ? ` • ${engineer.specialization}` : ''}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={engineer.is_active ? 'default' : 'secondary'}
                        className="shrink-0 rounded-full"
                      >
                        {engineer.is_active ? t('admin.isActive') : 'Inactive'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="overflow-hidden border-0 bg-card shadow-2xl sm:max-w-md">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-violet-500" />
          <DialogHeader className="pt-2">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserCog className="h-5 w-5 text-primary" />
              {t('admin.assignEngineer')}
            </DialogTitle>
            <DialogDescription>{t('admin.selectEngineer')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedRequest && (
              <div className="rounded-xl border bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                  {i18n.language === 'ar'
                    ? selectedRequest.service?.name_ar
                    : selectedRequest.service?.name_en}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {formatDateTime(selectedRequest.preferred_datetime, locale)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('admin.selectEngineer')}</Label>
              <Select value={selectedEngineerId} onValueChange={setSelectedEngineerId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t('admin.selectEngineer')} />
                </SelectTrigger>
                <SelectContent>
                  {engineers?.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id}>
                      {engineer.user.name} — {engineer.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {engineers && engineers.length === 0 && (
                <p className="text-sm text-muted-foreground">{t('admin.noEngineers')}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setAssignDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-primary to-cyan-600 font-semibold shadow-md hover:opacity-95"
              onClick={handleAssignEngineer}
              disabled={!selectedEngineerId || assigning}
            >
              {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
