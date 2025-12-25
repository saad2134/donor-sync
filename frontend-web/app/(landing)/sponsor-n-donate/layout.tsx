import { Metadata } from 'next';
import SponsorDonateClientPage from './page';

export const metadata: Metadata = {
  title: "Sponsor Us & Donate | DonorSync",
  description: "Donate or Sponsor the DonorSync platform to aid us in making the world a better place.",
};

export default function SponsorDonatePage() {
  return <SponsorDonateClientPage />;
}