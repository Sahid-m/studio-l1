
'use client';

import type { VideoSummary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Film,
  ThumbsUp,
  BarChart,
  Eye,
  MessageCircle,
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
  LabelList,
} from 'recharts';
import { ScrollArea } from './ui/scroll-area';

const engagementData = [
  { metric: 'Likes', value: 1200 },
  { metric: 'Comments', value: 150 },
  { metric: 'Shares', value: 300 },
  { metric: 'Saves', value: 450 },
];

const retentionData = {
  averageViewDuration: '1m 15s',
  totalWatchTime: '250 hours',
  audienceRetention: 75, // Percentage
};

const chartConfig = {
  value: {
    label: 'Count',
  },
};

export function VideoInsights({ video, onWheel }: { video: VideoSummary, onWheel: (e: React.WheelEvent<HTMLDivElement>) => void }) {
  return (
    <div className="h-full w-full bg-background" onWheel={onWheel}>
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
                <Eye className="w-5 h-5 text-primary" /> Audience Retention
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
                </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
