
'use client';

import type { VideoSummary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  BrainCircuit,
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
  XAxis,
  YAxis,
  Line,
  LineChart as RechartsLineChart,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import React from 'react';

const engagementData = [
  { metric: 'Likes', value: 1200 },
  { metric: 'Comments', value: 150 },
  { metric: 'Shares', value: 300 },
  { metric: 'Saves', value: 450 },
];

const retentionData = {
  averageViewDuration: '0:42',
  totalWatchTime: '250 hours',
  audienceRetention: 75, // Percentage
};

const retentionChartData = [
  { second: 0, retention: 100 },
  { second: 5, retention: 95 },
  { second: 10, retention: 90 },
  { second: 15, retention: 85 },
  { second: 20, retention: 80 },
  { second: 30, retention: 75 },
  { second: 45, retention: 60 },
  { second: 60, retention: 50 },
];


const engagementIcons = {
    Likes: ThumbsUp,
    Comments: MessageSquare,
    Shares: Share2,
    Saves: Bookmark,
}

const chartConfig = {
  value: {
    label: 'Count',
  },
  retention: {
    label: 'Retention',
    color: "hsl(var(--primary))",
  }
};

type VideoInsightsProps = {
    video: VideoSummary;
    onWheel: (event: React.WheelEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
};

export function VideoInsights({ video, onWheel, onTouchMove }: VideoInsightsProps) {
  return (
    <div className="h-full w-full bg-background" onWheel={onWheel} onTouchMove={onTouchMove}>
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8 pb-24 md:pb-8">
            <div className="text-center pt-4 md:pt-0">
                <BrainCircuit className="mx-auto h-10 w-10 text-primary" />
                <h1 className="font-headline text-3xl md:text-4xl font-bold mt-4">
                Video Insights
                </h1>
                <p className="text-muted-foreground text-sm md:text-base mt-1 line-clamp-1">
                For "{video.title}"
                </p>
            </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ThumbsUp className="w-5 h-5 text-primary" /> Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-56">
                <RechartsBarChart
                  data={engagementData}
                  accessibilityLayer
                  margin={{ top: 20 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="metric"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                    tickFormatter={(value) => value.substring(0, 3)}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        nameKey="value"
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={5}
                  >
                    <LabelList dataKey="value" position="top" offset={8} className="fill-foreground text-xs" />
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-5 h-5 text-primary" /> Audience View Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Avg. View Duration</p>
                    <p className="text-3xl font-bold text-primary">{retentionData.averageViewDuration}</p>
                </div>
                 <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Watch Time</p>
                    <p className="text-3xl font-bold text-primary">{retentionData.totalWatchTime}</p>
                </div>
                 <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Retention Rate</p>
                    <p className="text-3xl font-bold text-primary">{retentionData.audienceRetention}%</p>
                     <Progress value={retentionData.audienceRetention} className="w-3/4 h-1.5 mt-2" />
                </div>
            </CardContent>
          </Card>
           <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5 text-primary" /> Audience Retention Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="w-full h-64">
                    <RechartsLineChart
                        data={retentionChartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="second"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}s`}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value}%`}
                            width={40}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Line
                            dataKey="retention"
                            type="monotone"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
