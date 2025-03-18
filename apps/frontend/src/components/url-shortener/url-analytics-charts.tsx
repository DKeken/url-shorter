import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedUrl } from "@/types/url";

interface UrlAnalyticsChartsProps {
  url: SavedUrl;
}

const chartConfig = {
  visits: {
    label: "Visits",
    color: "var(--chart-1)",
  },
};

export function UrlAnalyticsCharts({ url }: UrlAnalyticsChartsProps) {
  if (!url.analytics) return null;

  return (
    <div className="space-y-4">
      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visits Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/3] h-[300px] w-full"
            config={chartConfig}
          >
            <BarChart data={url.analytics.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    weekday: "short",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {new Date(data.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Visits
                          </span>
                          <span className="font-bold">{data.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Countries Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visits by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/3] h-[300px] w-full"
            config={chartConfig}
          >
            <BarChart data={url.analytics.countriesStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="country"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 12 }}
                height={60}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Country
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.country}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Visits
                          </span>
                          <span className="font-bold">{data.count}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Percentage
                          </span>
                          <span className="font-bold">{data.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
