import { Metadata } from 'next';
import PartnerClientPage from './page';

export const metadata: Metadata = {
  title: "Partner With Us | DonorSync",
  description: "Partner with the DonorSync team to make the world a better place.",
};

export default function PartnerPage() {
  return <PartnerClientPage />;
}