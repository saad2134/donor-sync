'use server';

import { redirect } from 'next/navigation';
import { sendContactEmail } from './email';

export async function submitContactForm(formData: FormData) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return { success: false, error: 'All required fields must be filled.' };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    // In a real application, you would:
    // 1. Send an email using a service like Resend, SendGrid, etc.
    // 2. Save to a database
    // 3. Integrate with a CRM like HubSpot

    await sendContactEmail({
      name,
      email,
      company: company || undefined,
      subject,
      message,
    });

    // For demo purposes, we'll just return success
    // Replace this with actual email sending logic:
    // await sendEmail({ name, email, company, subject, message });

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}