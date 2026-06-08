import React from 'react';
import { Settings, RefreshCcw, Sun, Moon } from 'lucide-react';
import { Article, ReadingStyle } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsFeedProps {
  articles: Article[];
  topics: string[];
  lastUpdated: string | null;
  readingStyle: ReadingStyle;
  onOpenSettings: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function NewsFeed({
  articles, topics, lastUpdated, readingStyle,
  onOpenSettings, onRefresh, isLoading, darkMode, onToggleDark
}: NewsFeedProps) {

  const getUIText = (key: string) => {
    const textMap = {
      serious: {
        lastUpdated: "Updated",
        sections: "Sections",
        topStories: "Top Stories",
        refresh: "Refresh Edition",
        loading: "The presses are running...",
      },
      casual: {
        lastUpdated: "Fresh as of",
        sections: "Your feed",
        topStories: "Catch up",
        refresh: "Get fresh drops",
        loading: "Loading your vibe...",
      },
      genz: {
        lastUpdated: "Last check",
        sections: "Vibes",
        topStories: "Trending fr 📈",
        refresh: "Refresh rn",
        loading: "bestie hold on 🫶",
      },
    };
    return textMap[readingStyle]?.[key as keyof typeof textMap.serious] || key;
  };

  const formattedDateLong = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedDateShort = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '--:--';

  const heroArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className={`min-h-screen pb-24 theme-${readingStyle} bg-background text-foreground`}>

      {/* ── Masthead ─────────────────────────────────────────────── */}
      <header className="border-b-4 border-foreground pb-4 mb-6 pt-6 px-4 sm:px-8 max-w-7xl mx-auto">

        {/* Mobile masthead: title centered, then utility row below */}
        <div className="flex flex-col items-center gap-3 md:hidden mb-4">
          <h1 className="whitespace-nowrap text-3xl sm:text-5xl font-serif font-black tracking-tight text-center uppercase leading-none">
            The Daily Scroll
          </h1>
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium">
            <span className="uppercase tracking-widest">{formattedDateShort}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDark}
                data-testid="button-toggle-dark"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/70 text-foreground transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <span className="bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                {getUIText('lastUpdated')} {formattedTime}
              </span>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                data-testid="button-refresh"
                className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50"
                title={getUIText('refresh')}
              >
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop masthead: 3-col grid */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
          <div className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {formattedDateLong}
          </div>

          <h1 className="whitespace-nowrap text-5xl lg:text-7xl xl:text-8xl font-serif font-black tracking-tight text-center uppercase leading-none">
            The Daily Scroll
          </h1>

          <div className="text-sm flex flex-col items-end gap-2 text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleDark}
                data-testid="button-toggle-dark-desktop"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/70 text-foreground transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <span className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                {getUIText('lastUpdated')} {formattedTime}
              </span>
            </div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              data-testid="button-refresh-desktop"
              className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="uppercase text-xs tracking-wider">{getUIText('refresh')}</span>
            </button>
          </div>
        </div>

        {/* Sections row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-t pt-3 border-border">
          <span className="font-serif italic text-muted-foreground text-sm">
            {getUIText('sections')}:
          </span>
          {topics.map(t => (
            <span
              key={t}
              className="text-xs uppercase tracking-wider font-bold border border-border px-2 sm:px-3 py-1 rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">

        {isLoading && articles.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground font-serif text-xl italic">
            {getUIText('loading')}
          </div>
        ) : (
          <>
            {/* Hero */}
            {heroArticle && (
              <section className="mb-10 border-b-2 border-border pb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-5 text-primary flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary inline-block flex-shrink-0" />
                  {getUIText('topStories')}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* Hero article */}
                  <div className="lg:col-span-8 group cursor-pointer">
                    <a href={heroArticle.url} target="_blank" rel="noreferrer" className="block">
                      <div className="aspect-video relative overflow-hidden bg-muted mb-4 sm:mb-6">
                        {heroArticle.urlToImage ? (
                          <img
                            src={heroArticle.urlToImage}
                            alt={heroArticle.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-lg text-muted-foreground italic">
                            No Image Available
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                        {heroArticle.title}
                      </h3>

                      {heroArticle.description && (
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl line-clamp-3 sm:line-clamp-none">
                          {heroArticle.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>{heroArticle.source}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDistanceToNow(new Date(heroArticle.publishedAt))} ago</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-primary">{heroArticle.topic}</span>
                      </div>
                    </a>
                  </div>

                  {/* Pull quote — only on large screens */}
                  <div className="hidden lg:flex lg:col-span-4 lg:border-l lg:border-border lg:pl-8 h-full flex-col justify-center">
                    {heroArticle.description && (
                      <div className="my-8">
                        <p className="font-serif text-3xl xl:text-4xl italic text-primary leading-tight relative">
                          <span className="absolute -left-4 -top-4 text-6xl text-muted opacity-30">"</span>
                          {heroArticle.description.split('.')[0]}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Article grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
              {gridArticles.map((article, i) => (
                <ArticleCard key={`${article.url}-${i}`} article={article} style={readingStyle} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Floating Settings Button */}
      <button
        onClick={onOpenSettings}
        data-testid="button-settings"
        className="fixed bottom-6 right-5 sm:right-6 p-3 sm:p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform z-40"
        title="Settings"
      >
        <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}

function ArticleCard({ article, style }: { article: Article; style: ReadingStyle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      data-testid={`card-article-${encodeURIComponent(article.url).slice(0, 20)}`}
      className={`block group break-inside-avoid mb-5 sm:mb-8 p-4 sm:p-5 transition-all ${
        style === 'casual'
          ? 'bg-card border rounded-2xl shadow-sm hover:shadow-md'
          : style === 'genz'
          ? 'bg-card border-2 border-border rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] hover:border-primary'
          : 'border-t border-b border-border py-5 hover:bg-muted/30'
      }`}
    >
      {article.urlToImage && (
        <div className={`w-full aspect-video bg-muted mb-3 sm:mb-4 overflow-hidden ${
          style === 'casual' || style === 'genz' ? 'rounded-lg' : ''
        }`}>
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
        <span className="text-primary">{article.topic}</span>
        <span>•</span>
        <span>{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
      </div>

      <h3 className={`font-serif font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight ${
        style === 'genz' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
      }`}>
        {article.title}
      </h3>

      {article.description && (
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-3 sm:mb-4">
          {article.description}
        </p>
      )}

      <div className="text-xs font-bold uppercase tracking-widest border-t border-border pt-3 text-muted-foreground">
        {article.source}
      </div>
    </a>
  );
}
