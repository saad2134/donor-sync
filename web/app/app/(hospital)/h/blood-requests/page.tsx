// --@ts-nocheck
"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ComingSoonPage() {
  const [ptab, setpTab] = useState("urgent");

  return (
    <ContentLayout title="Blood Requests">
      <Tabs value={ptab} onValueChange={setpTab} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="w-full" value="regular">Regular Patient Requests</TabsTrigger>
          <TabsTrigger className="w-full" value="urgent">Urgent Patient Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

            <div className="px-2">
              <h2 className="text-2xl font-semibold">Blood Requests from Patients</h2>
              <p className="text-foreground text-md mt-3">
                Here you can:
              </p>

              <ul className="list-disc list-inside text-foreground mt-2 space-y-2">
                <li>
                  Accept blood requests from <span className="text-accent">patients</span> and give them an appointment date.
                </li>
                <li>
                  Reject blood requests from <span className="text-accent">patients</span>.
                </li>
              </ul>
            </div>
          </div>
          <Card className="p-2">
          <p className="text-center text-gray-500">No matching patient requests.</p></Card>
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
        </TabsContent>
        <TabsContent value="urgent">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">

            <div className="px-2">
              <h2 className="text-2xl font-semibold text-accent">🚨 Urgent Blood Requests from Patients</h2>
              <p className="text-foreground text-md mt-3">
                Here you can:
              </p>

              <ul className="list-disc list-inside text-foreground mt-2 space-y-2">
                <li>
                  Accept blood requests from <span className="text-accent">patients</span> and give them an appointment date.
                </li>
                <li>
                  Reject blood requests from <span className="text-accent">patients</span>.
                </li>
              </ul>
            </div>
          </div>
          <Card className="p-2">
            <p className="text-center text-gray-500">No matching urgent patient requests.</p></Card>
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
        </TabsContent>
      </Tabs>

    </ContentLayout>
  );
}
