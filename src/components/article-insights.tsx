
'use client';

import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Smile, Tags, Target, PieChart, LineChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, Cell, Pie, PieChart as RechartsPieChart, Line, LineChart as RechartsLineChart } from "recharts"
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';

const sentimentData = [
    { name: 'Positive', value: 65, color: 'hsl(var(--chart-2))' },
    { name: 'Neutral', value: 25, color: 'hsl(var(--chart-3))' },
    { name: 'Negative', value: 10, color: 'hsl(var(--destructive))' },
];

const keywordData = [
    { name: 'AI', count: 25 },
    { name: 'Technology', count: 18 },
    { name: 'Future', count: 15 },
    { name: 'Society', count: 12 },
    { name: 'Data', count: 9 },
];

const readabilityData = [
    { metric: 'Score', value: 65 }, // Flesch-Kincaid Reading Ease
];

const barChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
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
    visitors: { label: "Visitors" },
    count: { label: "Frequency" },
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
    edge: { label: "Edge", color: "hsl(var(--chart-4))" },
    other: { label: "Other", color: "hsl(var(--chart-5))" },
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
    average: { label: "Average", color: "hsl(var(--chart-2))" },
    today: { label: "Today", color: "hsl(var(--chart-1))" },
  }

export function ArticleInsights({ article }: { article: Article }) {
  return (
    <div className="h-full w-full bg-muted/20">
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 pb-24 md:pb-8">
            <div className="text-center">
                <h1 className="font-headline text-3xl md:text-4xl font-bold">Insights</h1>
                <p className="text-muted-foreground text-sm md:text-base">For "{article.title}"</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Smile className="w-5 h-5" /> Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <ChartContainer config={{}} className="w-full h-48 -mt-4">
                        <RechartsPieChart accessibilityLayer>
                            <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                            <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={2}>
                                {sentimentData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </RechartsPieChart>
                    </ChartContainer>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {sentimentData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name} ({item.value}%)
                            </div>
                        ))}
                    </div>
                </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Readability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {readabilityData.map((data) => (
                          <div key={data.metric}>
                              <div className="flex justify-between mb-1 text-sm font-medium">
                                  <span>{data.metric}</span>
                                  <span>{data.value} / 100</span>
                              </div>
                              <Progress value={data.value} aria-label={`${data.metric}: ${data.value}`} />
                              <p className="text-xs text-muted-foreground mt-1">Higher is better. Aim for 60+.</p>
                          </div>
                      ))}
                      <div className="text-center pt-2">
                          <p className="text-sm font-medium">Est. Reading Time: <span className="text-primary">5 mins</span></p>
                          <p className="text-xs text-muted-foreground">(based on average reading speed)</p>
                      </div>
                  </CardContent>
              </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Tags className="w-5 h-5" /> Keyword Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="w-full h-64">
                        <RechartsBarChart data={keywordData} accessibilityLayer layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="count" />} />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} layout="vertical">
                                {keywordData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill="hsl(var(--primary))" />
                                ))}
                            </Bar>
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

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

    