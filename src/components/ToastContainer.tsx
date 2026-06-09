import { useToast } from '@/contexts/ToastContext';
import { Toast } from './ui/toast';

export function ToastContainer() {
  const { toast } = useToast();

  if (!toast) return null;

  return (
    <Toast
      title={toast.title}
      description={toast.description}
      variant={toast.variant}
    />
  );
}

