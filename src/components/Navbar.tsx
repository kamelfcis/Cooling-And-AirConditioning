import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            {t('landing.title')}
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {loading ? (
              <div className="text-sm text-muted-foreground">
                {t('common.loading')}
              </div>
            ) : user ? (
              <>
                {user.role === 'admin' && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">{t('nav.admin')}</Link>
                  </Button>
                )}
                {user.role === 'engineer' && (
                  <Button variant="ghost" asChild>
                    <Link to="/engineer">{t('nav.engineer')}</Link>
                  </Button>
                )}
                {user.role === 'customer' && (
                  <Button variant="ghost" asChild>
                    <Link to="/requests">{t('nav.requests')}</Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

