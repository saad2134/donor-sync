import { Metadata } from 'next';
import SponsorDonateClientPage from './page';
import { APP_CONFIG } from '@/config/CORE_CONFIG';

export const metadata: Metadata = {
  title: `Sponsor Us & Donate | ${APP_CONFIG.appName}`,
  description: `Donate or Sponsor the ${APP_CONFIG.appName} platform to aid us in making the world a better place.`,
};

export default function SponsorDonatePage() {
  return <SponsorDonateClientPage />;
}