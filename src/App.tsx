import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useLocalStorage } from "./hooks/use-local-storage";
import { OnboardingModal } from "./components/onboarding-modal";
import { NewsFeed } from "./components/news-feed";
import { useFetchNews } from "@/shared/api-client-react";
import { ReadingStyle, Article } from "./lib/types";

const queryClient = new QueryClient();

function AppContent() {
  const [userTopics, setUserTopics] = useLocalStorage<string[]>("userTopics", []);
  const [readingStyle, setReadingStyle] = useLocalStorage<ReadingStyle | null>("readingStyle", null);
  const [lastFetchTime, setLastFetchTime] = useLocalStorage<string | null>("lastFetchTime", null);
  const [cachedArticles, setCachedArticles] = useLocalStorage<Article[]>("cachedArticles", []);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempTopics, setTempTopics] = useState<string[]>([]);
  const [tempStyle, setTempStyle] = useState<ReadingStyle | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchNewsMutation = useFetchNews();

  useEffect(() => {
    // Show onboarding if not set up
    if (!readingStyle || userTopics.length === 0) {
      setTempTopics(userTopics);
      setTempStyle(readingStyle);
      setShowOnboarding(true);
    } else {
      // Check if we need to fetch
      const now = new Date().getTime();
      const lastFetch = lastFetchTime ? new Date(lastFetchTime).getTime() : 0;
      const sixHours = 6 * 60 * 60 * 1000;

      if (now - lastFetch > sixHours || cachedArticles.length === 0) {
        fetchData(userTopics);
      }
    }

    // Auto-refresh interval
    const interval = setInterval(() => {
      if (userTopics.length > 0) {
        fetchData(userTopics, true);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(interval);
  }, [userTopics, readingStyle]);

  const fetchData = async (topicsToFetch: string[], isBackground = false) => {
    if (topicsToFetch.length === 0) return;
    
    try {
      const response = await fetchNewsMutation.mutateAsync({ 
        data: { topics: topicsToFetch, pageSize: 15 } 
      });
      
      // Inject topic manually since the API response might not map it directly to each article if mixed, 
      // but assuming the proxy does or we assign based on request. The API shape says Article has `topic`.
      if (response && response.articles) {
        setCachedArticles(response.articles);
        setLastFetchTime(new Date().toISOString());
        
        if (isBackground) {
          toast.success("New articles have arrived. The Daily Scroll is updated.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
      toast.error("The presses are running slow. Retrying shortly...");
    }
  };

  const handleOnboardingComplete = () => {
    setUserTopics(tempTopics);
    setReadingStyle(tempStyle);
    setShowOnboarding(false);
    fetchData(tempTopics);
  };

  const handleOpenSettings = () => {
    setTempTopics(userTopics);
    setTempStyle(readingStyle);
    setShowOnboarding(true);
  };

  if (!readingStyle || showOnboarding) {
    return (
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          if (userTopics.length > 0 && readingStyle) {
            setShowOnboarding(false);
          }
        }}
        selectedTopics={tempTopics}
        onTopicsChange={setTempTopics}
        selectedStyle={tempStyle}
        onStyleChange={setTempStyle}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <NewsFeed
      articles={cachedArticles}
      topics={userTopics}
      lastUpdated={lastFetchTime}
      readingStyle={readingStyle}
      onOpenSettings={handleOpenSettings}
      onRefresh={() => fetchData(userTopics)}
      isLoading={fetchNewsMutation.isPending}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode(!darkMode)}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
