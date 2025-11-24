
'use client';

import type { ClinicalTrialPaper } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Target,
  Users,
  BrainCircuit,
  Globe,
  LineChart,
  BarChart3,
  Stethoscope,
  BarChartHorizontal,
  Download,
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
    LabelList,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';
import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

const efficacyData = [
  { name: 'Tirzepatide 15mg', value: -20.9, label: '-20.9%' },
  { name: 'Placebo', value: -3.1, label: '-3.1%' },
];

const safetyData = [
  { name: 'Nausea', value: 25 },
  { name: 'Diarrhea', value: 22 },
  { name: 'Constipation', value: 15 },
  { name: 'Vomiting', value: 12 },
];

const comparativeData = [
    { name: 'Drug A', efficacy: -20.9, safety: 25 },
    { name: 'Competitor X', efficacy: -15.5, safety: 18 },
    { name: 'Competitor Y', efficacy: -12.3, safety: 22 },
];

const chartConfig = {
  value: { label: 'Value' },
  efficacy: { label: 'Efficacy (% Change)', color: 'hsl(var(--chart-1))' },
  safety: { label: 'Adverse Events (%)', color: 'hsl(var(--chart-2))' },
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
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-6 pb-24 md:pb-8">
          <div className="overflow-x-hidden">
            <div className="text-center pt-4 md:pt-0">
                <div className="flex justify-center items-center gap-4">
                    <BrainCircuit className="mx-auto h-10 w-10 text-primary" />
                    <h1 className="font-headline text-3xl md:text-4xl font-bold">
                        AI-Powered Insights
                    </h1>
                     <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export to PDF</span>
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mt-1 line-clamp-1">
                For "{paper.title}"
                </p>
            </div>
            
            {isMounjaroPaper ? (
              <>
                <div>
                  <h2 className="font-headline text-2xl font-bold mb-4">Clinical Performance</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <LineChart className="w-5 h-5 text-primary" /> Efficacy Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="w-full h-48 md:h-56">
                                <RechartsBarChart accessibilityLayer data={efficacyData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                    <CartesianGrid horizontal={false} />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} className="text-xs" width={100} />
                                    <XAxis type="number" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={5}>
                                        <LabelList dataKey="label" position="right" offset={8} className="fill-foreground font-medium" />
                                    </Bar>
                                </RechartsBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertTriangle className="w-5 h-5 text-primary" /> Safety Profile
                            </CardTitle>
                        </CardHeader>
                         <CardContent>
                            <ChartContainer config={chartConfig} className="w-full h-[250px] md:h-64">
                               <RechartsBarChart accessibilityLayer data={safetyData} layout="horizontal" margin={{ top: 20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" type="category" tickLine={false} axisLine={false} className="text-xs" />
                                    <YAxis type="number" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={5}>
                                        <LabelList dataKey="value" position="top" offset={8} className="fill-foreground font-medium" formatter={(value: number) => `${value}%`} />
                                    </Bar>
                                </RechartsBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart3 className="w-5 h-5 text-primary" /> Comparative Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ChartContainer config={chartConfig} className="w-full h-64 md:h-80">
                               <RechartsBarChart accessibilityLayer data={comparativeData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Bar dataKey="efficacy" fill="hsl(var(--chart-1))" name="Efficacy (% Change)" radius={4} />
                                    <Bar dataKey="safety" fill="hsl(var(--chart-2))" name="Adverse Events (%)" radius={4} />
                                </RechartsBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h2 className="font-headline text-2xl font-bold mb-4">Market Landscape</h2>
                   <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="w-5 h-5 text-primary" /> Available Markets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                                <Image 
                                    src="https://picsum.photos/seed/worldmap/1280/720"
                                    alt="World map of available markets"
                                    layout="fill"
                                    objectFit="cover"
                                    data-ai-hint="world map"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <p className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-md">Placeholder Map</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-bold mb-4">Disease Area</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Stethoscope className="w-5 h-5 text-primary" /> Disease Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                           <p><strong>Obesity:</strong> A complex, multifactorial chronic disease characterized by excessive body fat accumulation. It increases the risk of numerous health problems, including type 2 diabetes, cardiovascular disease, and certain cancers.</p>
                           <p><strong>Prevalence:</strong> Affects over 650 million adults worldwide, with rates continuing to rise. It is a major public health challenge globally.</p>
                           <p><strong>Existing Treatments:</strong> Include lifestyle modifications (diet, exercise), pharmacotherapy (e.g., GLP-1 receptor agonists), and bariatric surgery. Tirzepatide (a GIP/GLP-1 receptor co-agonist) represents a newer, highly effective class of treatment.</p>
                        </CardContent>
                    </Card>
                </div>
              </>
            ) : (
                <div className="text-center py-16 px-4">
                    <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Insights Coming Soon</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Detailed AI-powered insights for this paper are not yet available. Check back later!</p>
                </div>
            )}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}

    