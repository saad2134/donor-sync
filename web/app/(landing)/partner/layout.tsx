import { Metadata } from 'next';
import PartnerClientPage from './page';
import { APP_CONFIG } from '@/config/CORE_CONFIG';

export const metadata: Metadata = {
  title: `Partner With Us | ${APP_CONFIG.appName}`,
  description: `Partner with the ${APP_CONFIG.appName} team to make the world a better place.`,
};

export default function PartnerPage() {
  return <PartnerClientPage />;
}