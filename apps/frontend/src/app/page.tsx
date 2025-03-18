"use client";

import { useState, useEffect } from "react";
import {
  UrlShortenerLayout,
  Header,
  FeatureCards,
  ShortenerForm,
  ShortenedUrlDisplay,
  Footer,
} from "@/components/url-shortener";
import { SavedUrlsList } from "@/components/url-shortener/saved-urls-list";
import { useUrlStore } from "@/lib/stores/url.store";

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const { savedUrls, refreshAllUrls, addNewUrl } = useUrlStore();

  // Set up periodic refresh (every 60 seconds)
  useEffect(() => {
    if (savedUrls.length === 0) return;

    const intervalId = setInterval(() => {
      refreshAllUrls();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [savedUrls, refreshAllUrls]);

  const handleUrlCreated = async (newShortUrl: string) => {
    setShortUrl(newShortUrl);
    await addNewUrl(newShortUrl);
  };

  return (
    <UrlShortenerLayout>
      <Header />
      <FeatureCards />
      <ShortenerForm onSuccess={handleUrlCreated} />
      {shortUrl && <ShortenedUrlDisplay shortUrl={shortUrl} />}

      <SavedUrlsList />

      <Footer />
    </UrlShortenerLayout>
  );
}
