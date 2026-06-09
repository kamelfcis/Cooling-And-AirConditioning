import { useTranslation } from 'react-i18next';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from '@/components/ServiceCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSlider } from '@/components/HeroSlider';
import { Wrench, DollarSign, Shield, Loader2, Sparkles } from 'lucide-react';

export function LandingPage() {
  const { t, i18n } = useTranslation();
  const { data: services, isLoading } = useServices();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('landing.whyChooseUs')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{t('landing.professional')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing.professionalDesc')}</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{t('landing.affordable')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing.affordableDesc')}</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{t('landing.reliable')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('landing.reliableDesc')}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>{t('landing.availableServices')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {t('landing.availableServices')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.availableServicesDesc') || 'اختر الخدمة التي تحتاجها وسنقوم بتوصيلها إليك'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              </div>
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Wrench className="h-10 w-10 text-primary/40" />
              </div>
              <p className="text-lg text-muted-foreground">{t('services.noServices')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

