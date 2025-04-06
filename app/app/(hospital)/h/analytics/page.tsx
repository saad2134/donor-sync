// --@ts-nocheck

"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const now = new Date();




const pastPatientCountChartData = [];

for (let i = 5; i >= 0; i--) {
  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  pastPatientCountChartData.push({
    month: months[date.getMonth()],
    desktop: Math.floor(Math.random() * 100) + 50, // Random dummy data
  });
}

console.log(pastPatientCountChartData);

const chartConfig = {
  desktop: {
    label: "Patients",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig


const bloodGroupChartData = [
  { month: "AB-", desktop: 20 },
  { month: "O+", desktop: 186 },
  { month: "O-", desktop: 305 },
  { month: "A+", desktop: 237 },
  { month: "A-", desktop: 273 },
  { month: "B+", desktop: 209 },
  { month: "B-", desktop: 214 },
  { month: "AB+", desktop: 30 },
  
]



export default function ComingSoonPage() {
  return (
    <ContentLayout title="Analytics & Reports">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Accepted Patient Blood Requests</CardTitle>
            <CardDescription>Past 6 Months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={pastPatientCountChartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
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
          </CardContent>
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle>Accepted Patient Blood Groups</CardTitle>
            <CardDescription>
              Showing blood groups all patient requests taken.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={bloodGroupChartData} >
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="month"  />
                <PolarGrid className="p-1"/>
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
          </CardContent>

        </Card>

      </div>
    </ContentLayout>
  );
}
