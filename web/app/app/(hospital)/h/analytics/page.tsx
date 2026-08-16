// --@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BLOOD_GROUPS = [
  { short: "O+", key: "op" },
  { short: "O-", key: "on" },
  { short: "A+", key: "ap" },
  { short: "A-", key: "an" },
  { short: "B+", key: "bp" },
  { short: "B-", key: "bn" },
  { short: "AB+", key: "abp" },
  { short: "AB-", key: "abn" },
];

const chartConfig = {
  desktop: {
    label: "Count",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { userId } = useUser();
  const [loading, setLoading] = useState(true);

  // Dynamic Chart Data states
  const [requestsHistoryChart, setRequestsHistoryChart] = useState<any[]>([]);
  const [bloodGroupsDistributionChart, setBloodGroupsDistributionChart] = useState<any[]>([]);

  useEffect(() => {
    if (!userId || !db) return;

    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Patient Requests directed to this hospital with status "accepted"
        const requestsRef = collection(db, "patient-requests");
        const q = query(
          requestsRef,
          where("targetHospitalId", "==", userId),
          where("status", "==", "accepted")
        );
        const qSnap = await getDocs(q);
        const acceptedRequests = qSnap.docs.map(doc => doc.data());

        // 2. Generate 6-month historical counts for Accepted Patient Blood Requests
        const now = new Date();
        const past6MonthsData = [];
        for (let i = 5; i >= 0; i--) {
          const date = subMonths(now, i);
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          const monthName = months[date.getMonth()];

          // Filter requests accepted in this month range
          const monthCount = acceptedRequests.filter(req => {
            if (!req.createdAt) return false;
            const reqDate = new Date(req.createdAt.seconds * 1000);
            return reqDate >= monthStart && reqDate <= monthEnd;
          }).length;

          past6MonthsData.push({
            month: monthName,
            desktop: monthCount,
          });
        }
        setRequestsHistoryChart(past6MonthsData);

        // 3. Generate Radar Chart Data: Blood Group Distribution of Accepted Requests
        const groupCounts = BLOOD_GROUPS.reduce((acc, bg) => {
          acc[bg.short] = 0;
          return acc;
        }, {});

        acceptedRequests.forEach(req => {
          if (groupCounts[req.bloodGroupNeeded] !== undefined) {
            groupCounts[req.bloodGroupNeeded] += Number(req.bloodQtyNeeded || 1);
          }
        });

        const radarData = BLOOD_GROUPS.map(bg => ({
          month: bg.short,
          desktop: groupCounts[bg.short] || 0,
        }));
        setBloodGroupsDistributionChart(radarData);

      } catch (err) {
        console.error("Failed to load hospital analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [userId]);

  return (
    <ContentLayout title="Analytics &amp; Reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {/* Chart 1: Monthly Transfusion Trends */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle>Transfusions Scheduled</CardTitle>
            <CardDescription>Number of patient requests accepted over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading historical data...</div>
            ) : (
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={requestsHistoryChart}
                  layout="vertical"
                  margin={{ right: 16 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <XAxis dataKey="desktop" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="desktop"
                    layout="vertical"
                    fill="var(--color-desktop)"
                    radius={4}
                  >
                    <LabelList
                      dataKey="month"
                      position="insideLeft"
                      offset={8}
                      className="fill-[--color-label]"
                      fontSize={12}
                    />
                    <LabelList
                      dataKey="desktop"
                      position="right"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Chart 2: Blood Group Radar Chart */}
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl">
          <CardHeader className="items-center text-center">
            <CardTitle>Transfusion Blood Groups</CardTitle>
            <CardDescription>
              Volume (units) of scheduled transfusions per blood group
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Loading group details...</div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadarChart data={bloodGroupsDistributionChart}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="month" />
                  <PolarGrid className="p-1" />
                  <Radar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.6}
                    dot={{
                      r: 4,
                      fillOpacity: 1,
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
