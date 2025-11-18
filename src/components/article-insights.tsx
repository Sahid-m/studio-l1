
'use client';

import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart } from "recharts"
import { ScrollArea } from './ui/scroll-area';

const barChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  
const lineChartData = [
{ average: 10, today: 15 },
{ average: 20, today: 25 },
{ average: 30, today: 35 },
{ average: 40, today: 45 },
{ average: 50, today: 55 },
]

const pieChartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    average: {
        label: "Average",
        color: "hsl(var(--chart-2))",
      },
      today: {
        label: "Today",
        color: "hsl(var(--chart-1))",
      },
  }

export function ArticleInsights({ article }: { article: Article }) {
  return (
    <div className="h-full w-full bg-muted/20 p-4 md:p-6 pb-24 md:pb-6">
        <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="font-headline text-3xl md:text-4xl font-bold">Insights</h1>
                    <p className="text-muted-foreground">For "{article.title}"</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" /> Monthly Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="w-full h-64">
                            <RechartsBarChart data={barChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </RechartsBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5" /> Reading Time Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="w-full h-64">
                            <RechartsLineChart data={lineChartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={() => ''} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="average" stroke="var(--color-average)" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="today" stroke="var(--color-today)" strokeWidth={2} dot={false} />
                            </RechartsLineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" /> Traffic Source</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={chartConfig} className="w-full h-64">
                            <RechartsPieChart accessibilityLayer>
                                <ChartTooltip content={<ChartTooltipContent nameKey="visitors" />} />
                                <Pie data={pieChartData} dataKey="visitors" nameKey="browser" innerRadius={50} outerRadius={80} />
                            </RechartsPieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
      </ScrollArea>
    </div>
  );
}
