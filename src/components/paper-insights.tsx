
'use client';

import type { ClinicalTrialPaper } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart2,
  Smile,
  Tags,
  Target,
  PieChart as PieChartIcon,
  TrendingUp,
  BrainCircuit,
  Clock,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Line,
  LineChart as RechartsLineChart,
  Label,
  LabelList,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';

const sentimentData = [
  { name: 'Positive', value: 65, color: 'hsl(var(--chart-2))' },
  { name: 'Neutral', value: 25, color: 'hsl(var(--chart-3))' },
  { name: 'Negative', value: 10, color: 'hsl(var(--destructive))' },
];

const keywordData = [
  { name: 'Efficacy', count: 25 },
  { name: 'Safety', count: 18 },
  { name: 'Placebo', count: 15 },
  { name: 'Cognitive', count: 12 },
  { name: 'Subjects', count: 9 },
];

const readabilityData = {
  score: 45, // Flesch-Kincaid Reading Ease for scientific papers is lower
  gradeLevel: 'Postgraduate',
  readingTime: '15 mins',
};

const chartConfig = {
  count: {
    label: 'Frequency',
  },
};

export function PaperInsights({ paper, onWheel }: { paper: ClinicalTrialPaper, onWheel: (e: React.WheelEvent<HTMLDivElement>) => void }) {
  return (
    <div className="h-full w-full bg-background" onWheel={onWheel}>
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8 pb-24 md:pb-8">
          <div className="text-center pt-4 md:pt-0">
            <BrainCircuit className="mx-auto h-10 w-10 text-primary" />
            <h1 className="font-headline text-3xl md:text-4xl font-bold mt-4">
              Paper Insights
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1 line-clamp-1">
              For "{paper.title}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smile className="w-5 h-5 text-primary" /> Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-2">
                <ChartContainer
                  config={{}}
                  className="w-full h-36 aspect-square"
                >
                  <RechartsPieChart accessibilityLayer>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={30}
                      outerRadius={50}
                      strokeWidth={2}
                    >
                       <LabelList
                        dataKey="name"
                        className="fill-background text-xs font-medium"
                        stroke="none"
                        formatter={(value: string) =>
                            sentimentData.find((d) => d.name === value)?.value + "%"
                        }
                      />
                      {sentimentData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ChartContainer>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tags className="w-5 h-5 text-primary" /> Keyword Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-48">
                  <RechartsBarChart
                    data={keywordData}
                    accessibilityLayer
                    layout="vertical"
                    margin={{ left: 10, right: 30 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-xs"
                    />
                    <XAxis type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          nameKey="count"
                          hideLabel
                        />
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={4}
                      layout="vertical"
                    >
                        <LabelList dataKey="count" position="right" offset={8} className="fill-foreground text-xs" />
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" /> Readability Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Reading Ease</p>
                    <p className="text-3xl font-bold text-primary">{readabilityData.score}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lower is harder (Sci. Papers)</p>
                </div>
                 <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Grade Level</p>
                    <p className="text-3xl font-bold text-primary">{readabilityData.gradeLevel}</p>
                    <p className="text-xs text-muted-foreground mt-1">Equivalent US school level</p>
                </div>
                 <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Est. Reading Time</p>
                    <p className="text-3xl font-bold text-primary">{readabilityData.readingTime}</p>
                    <p className="text-xs text-muted-foreground mt-1">Based on 150 WPM</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
