// --@ts-nocheck
"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DonationHistoryPage() {
  return (
    <ContentLayout title="Upcoming Appointments">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

        <div className="px-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
          </div>
          <p className="text-foreground text-md mt-3">
            Here you will see your <span className="text-accent">upcoming appointments</span> at hospitals for blood donation.
          </p>
          <p className="text-foreground text-md mt-3">
            We thank you for your willingness to help save a life!
          </p>
        </div>
      </div>
      <Card className="p-2">
        <p className="text-center text-gray-500">No records.</p></Card>
      <div className="flex justify-center mt-6 space-x-2">
        <Button

          disabled
          className="bg-accent"
        >
          Previous
        </Button>
        <span className="px-4 py-2">1 / 1</span>
        <Button

          disabled
          className="bg-accent"
        >
          Next
        </Button>
      </div>
    </ContentLayout>
  );
}
