// --@ts-nocheck
import { ContentLayout } from "@/components/admin-panel/content-layout";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function NotificationsPage() {
  return (
    <ContentLayout title="Coming Soon">
      <Card className="rounded-2xl shadow-md border border-muted">
        <CardContent className="p-10 py-20">
          <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] space-y-6">
            <Image
              src="/no-notifications.webp"
              alt="No Notifications"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
            <h1 className="text-center text-2xl font-semibold text-muted-foreground">
              All Clear!<br />
              You currently have no notifications.
            </h1>
          </div>
        </CardContent>
      </Card>


    </ContentLayout>
  );
}
