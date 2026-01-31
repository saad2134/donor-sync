import { Metadata } from 'next';
import PricingClientPage from './page'; // Rename original page
import { APP_CONFIG } from '@/config/CORE_CONFIG';

export const metadata: Metadata = {
  title: `Pricing | ${APP_CONFIG.appName}`,
  description: `Understand the pricing structure for services on the ${APP_CONFIG.appName} platform.`,
};

export default function PricingPage() {
  return <PricingClientPage />;
}