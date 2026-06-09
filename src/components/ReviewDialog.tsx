import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { ServiceRequest } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ReviewDialogProps {
  request: ServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDialog({ request, open, onOpenChange }: ReviewDialogProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewForm) => {
    if (!request.engineer_id) {
      showToast({
        title: t('common.error'),
        description: 'No engineer assigned',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        service_request_id: request.id,
        engineer_id: request.engineer_id,
        customer_id: request.customer_id,
        rating: data.rating,
        comment: data.comment,
      });

      if (error) throw error;

      showToast({
        title: t('common.success'),
        description: t('reviews.reviewSubmitted'),
      });

      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reviews.rateEngineer')}</DialogTitle>
          <DialogDescription>{t('reviews.writeReview')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('reviews.rating')}</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setValue('rating', value);
                    }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive">
                  {t(errors.rating.message || 'validation.ratingRequired')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">{t('reviews.comment')}</Label>
              <Textarea id="comment" {...register('comment')} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? t('common.loading') : t('reviews.submitReview')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

