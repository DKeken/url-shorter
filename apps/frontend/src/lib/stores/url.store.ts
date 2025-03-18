import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SavedUrl } from "@/types/url";
import { COOKIES } from "@/lib/constants";
import { getUrlInfo, getUrlAnalytics, deleteUrl } from "@/lib/api";
import { toast } from "sonner";

interface UrlStore {
  savedUrls: SavedUrl[];
  isRefreshing: boolean;
  refreshUrlAnalytics: (url: SavedUrl) => Promise<SavedUrl>;
  refreshAllUrls: (silent?: boolean) => Promise<void>;
  addNewUrl: (shortUrl: string) => Promise<void>;
  clearSavedUrls: () => void;
  deleteUrlItem: (shortCode: string) => Promise<void>;
}

export const useUrlStore = create<UrlStore>()(
  persist(
    (set, get) => ({
      savedUrls: [],
      isRefreshing: false,

      refreshUrlAnalytics: async (url: SavedUrl): Promise<SavedUrl> => {
        try {
          const analytics = await getUrlAnalytics(url.shortCode);
          return { ...url, analytics };
        } catch (error) {
          console.error(
            `Could not refresh analytics for ${url.shortCode}:`,
            error
          );
          return url;
        }
      },

      refreshAllUrls: async (silent?: boolean) => {
        const { savedUrls, isRefreshing, refreshUrlAnalytics } = get();
        if (savedUrls.length === 0 || isRefreshing) return;

        set({ isRefreshing: true });
        try {
          const refreshedUrls = await Promise.all(
            savedUrls.map((url) => refreshUrlAnalytics(url))
          );

          set({ savedUrls: refreshedUrls });
          if (!silent) {
            toast.success("Analytics refreshed");
          }
        } catch (error) {
          console.error("Error refreshing analytics:", error);
          if (!silent) {
            toast.error("Failed to refresh analytics");
          }
        } finally {
          set({ isRefreshing: false });
        }
      },

      addNewUrl: async (shortUrl: string) => {
        try {
          const shortCode = shortUrl.split("/").pop() || "";

          let originalUrl = "";
          let analytics = undefined;
          try {
            const [urlInfo, urlAnalytics] = await Promise.all([
              getUrlInfo(shortCode),
              getUrlAnalytics(shortCode),
            ]);
            originalUrl = urlInfo.originalUrl;
            analytics = urlAnalytics;
          } catch (error) {
            console.error("Could not fetch URL info or analytics:", error);
          }

          const newUrl: SavedUrl = {
            shortCode,
            originalUrl,
            createdAt: new Date().toISOString(),
            fullShortUrl: shortUrl,
            analytics,
          };

          const { savedUrls } = get();
          const updatedUrls = [newUrl, ...savedUrls].slice(0, 10);
          set({ savedUrls: updatedUrls });
        } catch (error) {
          console.error("Error saving URL:", error);
        }
      },

      clearSavedUrls: () => {
        const { savedUrls } = get();
        if (savedUrls.length > 0) {
          Promise.all(savedUrls.map((url) => deleteUrl(url.shortCode))).catch(
            (error) => console.error("Error deleting URLs:", error)
          );
        }
        set({ savedUrls: [] });
        toast.success("URLs cleared");
      },

      deleteUrlItem: async (shortCode: string) => {
        try {
          await deleteUrl(shortCode);
          const { savedUrls } = get();
          const updatedUrls = savedUrls.filter(
            (url) => url.shortCode !== shortCode
          );
          set({ savedUrls: updatedUrls });
          toast.success("URL deleted successfully");
        } catch (error) {
          console.error("Error deleting URL:", error);
          toast.error("Failed to delete URL");
        }
      },
    }),
    {
      name: COOKIES.SAVED_URLS,
    }
  )
);
