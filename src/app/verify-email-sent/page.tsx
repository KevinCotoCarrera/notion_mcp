import { useTranslations } from 'next-intl';

export default function VerifyEmailSentPage() {
  const t = useTranslations('email');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{t('verifyEmail')}</h1>
      <p>
        {t('sentVerification')}
      </p>
    </div>
  );
}
