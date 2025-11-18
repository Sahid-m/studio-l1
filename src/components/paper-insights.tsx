
'use client';

import type { ClinicalTrialPaper } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BrainCircuit,
  PieChart as PieChartIcon,
  Users,
  AlertTriangle,
  Target,
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
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';

const primaryEndpointData = [
    { name: 'Investigational Drug', value: -2.5, label: '-2.5 pts' },
    { name: 'Placebo', value: -0.5, label: '-0.5 pts' },
];

const adverseEventsData = [
  { name: 'Headache', value: 15, color: 'hsl(var(--chart-1))' },
  { name: 'Nausea', value: 12, color: 'hsl(var(--chart-2))' },
  { name: 'Fatigue', value: 8, color: 'hsl(var(--chart-3))' },
  { name: 'Dizziness', value: 5, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 10, color: 'hsl(var(--muted))' },
];

const patientDemographicsData = [
    { ageGroup: '65-70', count: 150 },
    { ageGroup: '71-75', count: 200 },
    { ageGroup: '76-80', count: 100 },
    { ageGroup: '81+', count: 50 },
];

const chartConfig = {
  count: {
    label: 'Patients',
  },
  value: {
      label: 'Change from Baseline'
  }
};

export function PaperInsights({ paper, onWheel }: { paper: ClinicalTrialPaper, onWheel: (e: React.WheelEvent<HTMLDivElement>) => void }) {
  return (
    <div className="h-full w-full bg-background" onWheel={onWheel}>
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8 pb-24 md:pb-8">
          <div className="text-center pt-4 md:pt-0">
            <BrainCircuit className="mx-auto h-10 w-10 text-primary" />
            <h1 className="font-headline text-3xl md:text-4xl font-bold mt-4">
              Clinical Trial Insights
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1 line-clamp-1">
              For "{paper.title}"
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" /> Primary Endpoint Results
              </CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Change in ADAS-Cog Score from Baseline at 18 Months
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-48">
                <RechartsBarChart data={primaryEndpointData} layout="vertical" margin={{left: 20, right: 40}}>
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} className="text-xs w-24" />
                    <XAxis type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={5}>
                        <LabelList dataKey="label" position="right" offset={8} className="fill-foreground font-medium text-xs" />
                    </Bar>
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5 text-primary" /> Adverse Event Profile
                </CardTitle>
                <p className="text-sm text-muted-foreground pt-1">
                    Most Common Reported Side Effects (%)
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                 <ChartContainer config={{}} className="w-full aspect-square max-h-[250px]">
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
                    <Pie data={adverseEventsData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} labelLine={false} >
                        {adverseEventsData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                        <LabelList 
                            dataKey="name" 
                            className="fill-foreground text-xs"
                            formatter={(value: string) => `${value} (${adverseEventsData.find(d => d.name === value)?.value}%)`}
                        />
                    </Pie>
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" /> Patient Demographics
                </CardTitle>
                 <p className="text-sm text-muted-foreground pt-1">
                    Age Distribution of Participants
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[250px]">
                  <RechartsBarChart data={patientDemographicsData} margin={{top: 20}}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="ageGroup" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                    <YAxis hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={4}>
                         <LabelList dataKey="count" position="top" offset={8} className="fill-foreground text-xs" />
                    </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
