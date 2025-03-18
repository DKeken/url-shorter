import {
  ExternalLink,
  Copy,
  RefreshCw,
  Trash2,
  ChevronDown,
  Users,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useUrlStore } from "@/lib/stores/url.store";
import { useMount } from "@/lib/hooks/use-mount";
import { useState } from "react";
import { UrlAnalyticsCharts } from "./url-analytics-charts";

export const SavedUrlsList = () => {
  const {
    savedUrls,
    isRefreshing,
    refreshAllUrls: onRefresh,
    clearSavedUrls: onClear,
    deleteUrlItem: onDelete,
  } = useUrlStore();

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useMount(onRefresh);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const toggleItem = (shortCode: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [shortCode]: !prev[shortCode],
    }));
  };

  if (savedUrls.length === 0) return null;

  return (
    <Card className="mt-12">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Your Recent URLs</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh()}
              className="text-sm"
              disabled={isRefreshing}
            >
              <RefreshCw
                size={14}
                className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-sm text-primary"
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedUrls.map((url) => (
            <Collapsible
              key={url.shortCode}
              open={openItems[url.shortCode]}
              onOpenChange={() => toggleItem(url.shortCode)}
              className="border border-primary/10 rounded-md overflow-hidden"
            >
              <div className="p-3 flex justify-between items-center hover:bg-primary/5">
                <div className="overflow-hidden">
                  <div className="font-medium flex items-center gap-2">
                    {url.shortCode}
                    <Badge variant="outline" className="text-xs">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </Badge>
                    {url.analytics && (
                      <Badge variant="secondary" className="text-xs">
                        {url.analytics.clickCount} clicks
                      </Badge>
                    )}
                    {url.analytics?.uniqueCountries !== undefined &&
                      url.analytics.uniqueCountries > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-50">
                          <Globe size={12} className="mr-1" />
                          {url.analytics.uniqueCountries}{" "}
                          {url.analytics.uniqueCountries === 1
                            ? "country"
                            : "countries"}
                        </Badge>
                      )}
                  </div>
                  {url.originalUrl && (
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {url.originalUrl}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              window.open(url.fullShortUrl, "_blank")
                            }
                          >
                            <ExternalLink size={15} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(url.fullShortUrl)}
                          >
                            <Copy size={15} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(url.shortCode)}
                          >
                            <Trash2 size={15} className="text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openItems[url.shortCode] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent>
                {url.analytics ? (
                  <div className="p-6">
                    <h4 className="font-medium mb-3">Analytics</h4>

                    {/* Recent Visits */}
                    {url.analytics.recentVisits &&
                      url.analytics.recentVisits.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2 flex items-center">
                            <Users size={14} className="mr-1" /> Recent Visits
                          </h5>
                          <div className="space-y-2">
                            {url.analytics.recentVisits.map((visit, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-sm p-2 bg-slate-50 rounded"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{visit.ip}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(visit.visitedAt).toLocaleString()}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {visit.geolocation &&
                                    visit.geolocation.country !== "Unknown" && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 flex items-center"
                                      >
                                        <MapPin size={12} className="mr-1" />
                                        {visit.geolocation.city
                                          ? `${visit.geolocation.city}, `
                                          : ""}
                                        {visit.geolocation.country}
                                      </Badge>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Analytics Charts */}
                    <UrlAnalyticsCharts url={url} />
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No analytics data available
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
