import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Service } from '@/lib/supabaseClient';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const name = i18n.language === 'ar' ? service.name_ar : service.name_en;
  const description = i18n.language === 'ar' ? service.description_ar : service.description_en;

  return (
    <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <Wrench className="h-6 w-6 text-primary" />
        </div>
      </div>

      <CardHeader className="relative pt-16 pb-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            {service.code}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative pb-4">
        <div className="flex items-baseline gap-2 mb-4">
          <div className="text-3xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
            {formatCurrency(service.base_price, i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {t('services.perUnit')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="relative pt-2">
        <Button
          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => navigate(`/request?serviceId=${service.id}`)}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {t('services.createRequest')}
            <ArrowLeft className={`h-4 w-4 transition-transform duration-300 ${i18n.language === 'ar' ? 'rotate-0' : 'rotate-180'} group-hover/btn:translate-x-1`} />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
        </Button>
      </CardFooter>
    </Card>
  );
}

