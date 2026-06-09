import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ServiceRequest, ServiceStatus } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';

export function EngineerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { requests, isLoading, updateStatus } = useServiceRequests();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<ServiceStatus>('pending');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Check if engineer profile exists
  const engineerRequests = requests.filter((r) => r.engineer_id);

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      updateStatus({
        id: selectedRequest.id,
        status,
        finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
        notes: notes || undefined,
      });

      showToast({
        title: t('common.success'),
        description: t('requests.updateStatus'),
      });

      setDialogOpen(false);
      setSelectedRequest(null);
      setStatus('pending');
      setFinalPrice('');
      setNotes('');
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

  const openUpdateDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setFinalPrice(request.final_price?.toString() || '');
    setNotes(request.notes || '');
    setDialogOpen(true);
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

  if (isLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!engineerProfile) {
    return null; // Will redirect to registration
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('engineer.title')}</h1>

      {engineerRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('engineer.noAssignedRequests')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {engineerRequests.map((request) => {
            const serviceName = i18n.language === 'ar'
              ? request.service?.name_ar
              : request.service?.name_en;

            return (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{serviceName}</CardTitle>
                      <CardDescription>
                        {t('requests.customer')}: {request.customer?.name}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {t(`status.${request.status}`)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('requests.acCount')}:</span>
                      <span>{request.ac_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('requests.preferredDateTime')}:</span>
                      <span>{formatDateTime(request.preferred_datetime, i18n.language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('requests.estimatedPrice')}:</span>
                      <span className="font-medium">
                        {formatCurrency(request.estimated_price, i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    {request.final_price && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('requests.finalPrice')}:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(request.final_price, i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                    )}
                    {request.notes && (
                      <div>
                        <span className="text-muted-foreground">{t('requests.notes')}:</span>
                        <p className="mt-1">{request.notes}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => openUpdateDialog(request)}
                    >
                      {t('engineer.updateStatus')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('engineer.updateStatus')}</DialogTitle>
            <DialogDescription>{t('engineer.updateStatus')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('requests.status')}</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ServiceStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="on_the_way">{t('status.on_the_way')}</SelectItem>
                  <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                  <SelectItem value="completed">{t('status.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalPrice">{t('engineer.enterFinalPrice')}</Label>
              <Input
                id="finalPrice"
                type="number"
                step="0.01"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder={selectedRequest?.estimated_price.toString()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('engineer.jobNotes')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

