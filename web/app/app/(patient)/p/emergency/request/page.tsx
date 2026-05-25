// --@ts-nocheck
"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function EmergencyRequestBloodPage() {
  return (
    <ContentLayout title="Emergency Request Blood">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

        <div className="px-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold text-accent">Emergency Request Blood</h2>
          </div>
          <p className="text-foreground text-md mt-3">
            Here you will find <span className="text-accent">hospitals</span> to submit an <span className="text-accent">emergency blood request</span> to.
          </p>
          <p className="text-foreground text-sm mt-3">
            Looking forward to seeing you back, stronger and happier than ever!
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
