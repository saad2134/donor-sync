import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface Service {
  name: string;
  check: () => Promise<boolean>;
}

const services: Service[] = [
  {
    name: 'Frontend Web (Vercel)',
    check: async () => {
      try {
        const res = await fetch('https://vercel.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Database (Firebase)',
    check: async () => {
      try {
        const res = await fetch('https://firebase.google.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'File Upload (Uploadcare)',
    check: async () => {
      try {
        const res = await fetch('https://upload.uploadcare.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Authentication (PhoneEmail)',
    check: async () => {
      try {
        const res = await fetch('https://auth.phone.email', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Syncbot Chatbot',
    check: async () => {
      try {
        const res = await fetch('https://generativelanguage.googleapis.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Feedback Collection (Apps Script)',
    check: async () => {
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbzxm5TmObKpnsht5_AtI4D-9gBbLUahnbiFGHxXjTM-xIRlNeKihnwbFoCHxyiz9rPI/exec', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
];

export async function GET() {
  const results = await Promise.all(
    services.map(async (service) => {
      const status = await service.check();
      return {
        name: service.name,
        status,
        timestamp: new Date().toISOString(),
      };
    })
  );

  const allOperational = results.every((result) => result.status);
  const hasIssues = results.some((result) => !result.status);

  return NextResponse.json({
    status: allOperational ? 'operational' : hasIssues ? 'issues' : 'degraded',
    services: results,
    checkedAt: new Date().toISOString(),
  });
}
