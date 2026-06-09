import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  UserPlus,
  Wrench,
} from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'validation.minLength'),
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(6, 'validation.minLength'),
  phone: z.string().optional(),
  role: z.enum(['customer', 'engineer']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            phone: data.phone ?? null,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        showToast({
          title: t('common.success'),
          description: t('auth.registerSuccess'),
        });

        navigate('/login');
      }
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

  const rolePills = [
    { icon: User, label: t('roles.customer') },
    { icon: Wrench, label: t('roles.engineer') },
    { icon: Shield, label: t('roles.admin') },
  ];

  return (
    <div className="min-h-screen bg-muted/30 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Brand panel — same structure as Login */}
      <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-80" />

        <div className="relative z-10 space-y-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-100/90 transition hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t('nav.home')}
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              HVAC
            </div>
            <h1 className="mt-6 max-w-lg text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl">
              {t('auth.loginSideTitle')}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-300">{t('auth.loginSideDesc')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {rolePills.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/95 backdrop-blur transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4 text-cyan-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} · {t('landing.title')}
        </p>
      </aside>

      <main className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8 lg:min-h-0 lg:py-12 lg:pe-12 xl:pe-20">
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-cyan-900 p-6 text-white shadow-xl lg:hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/40 blur-2xl" />
          <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            HVAC
          </div>
          <h2 className="relative mt-2 text-2xl font-bold">{t('auth.register')}</h2>
          <p className="relative mt-2 text-sm text-slate-300">{t('auth.registerSubtitle')}</p>
        </div>

        <Card className="relative mx-auto w-full max-w-lg overflow-hidden border-0 shadow-2xl ring-1 ring-border/60">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-teal-500" />
          <CardHeader className="space-y-2 pb-2 pt-8 text-center sm:pt-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-600 text-primary-foreground shadow-lg">
              <UserPlus className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">{t('auth.register')}</CardTitle>
            <CardDescription className="text-base leading-relaxed">{t('auth.registerSubtitle')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 px-6 sm:px-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  {t('auth.name')}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    autoComplete="name"
                    className="h-12 rounded-xl border-2 ps-10 shadow-sm transition focus-visible:border-primary/50"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{t(errors.name.message || 'validation.required')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-xl border-2 ps-10 shadow-sm transition focus-visible:border-primary/50"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{t(errors.email.message || 'validation.required')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  {t('auth.phone')}
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t('auth.phone')}
                    className="h-12 rounded-xl border-2 ps-10 shadow-sm transition focus-visible:border-primary/50"
                    {...register('phone')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t('auth.registerAs')}</Label>
                <Select value={role} onValueChange={(value) => setValue('role', value as 'customer' | 'engineer')}>
                  <SelectTrigger className="h-12 rounded-xl border-2 bg-background/80 shadow-sm transition hover:border-primary/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">{t('roles.customer')}</SelectItem>
                    <SelectItem value="engineer">{t('roles.engineer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="h-12 rounded-xl border-2 pe-11 shadow-sm transition focus-visible:border-primary/50"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{t(errors.password.message || 'validation.required')}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-6 pb-8 pt-2 sm:px-8 sm:pb-10">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-cyan-600 to-teal-600 text-base font-semibold shadow-lg shadow-primary/20 transition hover:opacity-[0.98] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="me-2 h-5 w-5 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('auth.register')}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
                >
                  {t('auth.login')}
                </Link>
              </p>
              <Button variant="ghost" className="w-full rounded-xl text-muted-foreground" asChild>
                <Link to="/">{t('nav.home')}</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
