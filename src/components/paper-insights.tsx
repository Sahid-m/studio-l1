
'use client';

import type { ClinicalTrialPaper } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Target,
  Users,
  BrainCircuit,
  User,
  Activity,
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
  Cell,
  LabelList,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';
import React from 'react';

// Data from SURMOUNT-1 Trial for Mounjaro (Tirzepatide)
const primaryEndpointData = [
    { name: 'Tirzepatide 15mg', value: -20.9, label: '-20.9%' },
    { name: 'Placebo', value: -3.1, label: '-3.1%' },
];

const adverseEventsData = [
  { name: 'Nausea', value: 25, color: 'hsl(var(--chart-1))' },
  { name: 'Diarrhea', value: 22, color: 'hsl(var(--chart-2))' },
  { name: 'Constipation', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Vomiting', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 26, color: 'hsl(var(--muted))' },
];

const patientDemographicsData = {
    meanAge: '45 years',
    sex: '67.5% Female',
    meanWeight: '104.8 kg',
    meanBmi: '38.0 kg/m²',
};


const chartConfig = {
  count: {
    label: 'Patients',
  },
  value: {
      label: 'Change from Baseline (%)'
  }
};

type PaperInsightsProps = {
  paper: ClinicalTrialPaper;
  onWheel: (event: React.WheelEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
};

export function PaperInsights({ paper, onWheel, onTouchMove }: PaperInsightsProps) {
  const isMounjaroPaper = paper.id === '1';

  return (
    <div className="h-full w-full bg-background" onWheel={onWheel} onTouchMove={onTouchMove}>
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
            
            {isMounjaroPaper ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-primary" /> Primary Endpoint Results
                    </CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                      Mean Percent Change in Body Weight at 72 Weeks
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="w-full h-48">
                      <RechartsBarChart data={primaryEndpointData} layout="vertical" margin={{left: 40, right: 40}}>
                          <CartesianGrid horizontal={false} />
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} className="text-xs w-24" width={100} />
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
                        <Users className="w-5 h-5 text-primary" /> Participant Baseline
                      </CardTitle>
                       <p className="text-sm text-muted-foreground pt-1">
                          Key characteristics of the study population at entry.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><User /> Mean Age</span>
                            <span className="font-medium">{patientDemographicsData.meanAge}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Users /> Sex</span>
                            <span className="font-medium">{patientDemographicsData.sex}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Activity /> Mean Weight</span>
                            <span className="font-medium">{patientDemographicsData.meanWeight}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Activity /> Mean BMI</span>
                            <span className="font-medium">{patientDemographicsData.meanBmi}</span>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Detailed insights for this paper are not yet available.</p>
                </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
