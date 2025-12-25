import { Metadata } from 'next';
import PricingClientPage from './page'; // Rename original page

export const metadata: Metadata = {
  title: "Pricing | DonorSync",
  description: "Understand the pricing structure for services on the DonorSync platform.",
};

export default function PricingPage() {
  return <PricingClientPage />;
}