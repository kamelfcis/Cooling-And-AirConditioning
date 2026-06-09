import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';

const registrationSchema = z.object({
  city: z.string().min(1, 'validation.required'),
  specialization: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function EngineerRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationForm) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Check if engineer profile already exists
      const { data: existing } = await supabase
        .from('engineers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        showToast({
          title: t('common.error'),
          description: 'Engineer profile already exists',
          variant: 'destructive',
        });
        navigate('/engineer');
        return;
      }

      const { error } = await supabase.from('engineers').insert({
        user_id: user.id,
        city: data.city,
        specialization: data.specialization,
        years_experience: data.yearsExperience,
        is_active: true,
      });

      if (error) throw error;

      showToast({
        title: t('common.success'),
        description: t('engineer.registration'),
      });

      navigate('/engineer');
    } catch (error: any) {
      showToast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">{t('auth.login')} للوصول إلى هذه الصفحة</p>
        <Button onClick={() => navigate('/login')}>{t('nav.login')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('engineer.registration')}</CardTitle>
          <CardDescription>{t('engineer.registerAsEngineer')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t('engineer.city')}</Label>
              <Input id="city" {...register('city')} />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {t(errors.city.message || 'validation.required')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">{t('engineer.specialization')}</Label>
              <Textarea id="specialization" {...register('specialization')} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">{t('engineer.yearsExperience')}</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                {...register('yearsExperience', { valueAsNumber: true })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('common.loading') : t('common.submit')}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

