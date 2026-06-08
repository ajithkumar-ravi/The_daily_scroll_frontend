import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check } from "lucide-react";
import { ReadingStyle } from "../lib/types";

const SUGGESTED_TOPICS = [
  "Tech", "Cricket", "AI", "Finance", "Science", 
  "Entertainment", "Sports", "Politics", "Health", "Startups"
];

const STYLES = [
  {
    id: "serious" as ReadingStyle,
    name: "The Editor",
    desc: "Straight facts, classic layout, authoritative tone"
  },
  {
    id: "casual" as ReadingStyle,
    name: "The Insider",
    desc: "Conversational, bold, and easy to digest"
  },
  {
    id: "genz" as ReadingStyle,
    name: "The Vibe",
    desc: "Short, snappy, no cap, internet-native language"
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  selectedStyle: ReadingStyle | null;
  onStyleChange: (style: ReadingStyle) => void;
  onComplete: () => void;
}

export function OnboardingModal({
  isOpen, onClose, selectedTopics, onTopicsChange, selectedStyle, onStyleChange, onComplete
}: Props) {
  const [customTopic, setCustomTopic] = useState("");

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onTopicsChange(selectedTopics.filter(t => t !== topic));
    } else {
      onTopicsChange([...selectedTopics, topic]);
    }
  };

  const handleCustomTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTopic.trim()) {
      const topic = customTopic.trim();
      if (!selectedTopics.includes(topic)) {
        onTopicsChange([...selectedTopics, topic]);
      }
      setCustomTopic("");
    }
  };

  const canStart = selectedTopics.length > 0 && selectedStyle !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="w-full max-w-3xl bg-card text-card-foreground shadow-xl rounded-xl sm:rounded-2xl border flex flex-col my-auto"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold">Customize Your Scroll</h2>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">1. Choose your topics</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {SUGGESTED_TOPICS.map(topic => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'bg-transparent hover:bg-muted border-border'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                    {selectedTopics.filter(t => !SUGGESTED_TOPICS.includes(t)).map(topic => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-colors border bg-primary text-primary-foreground border-primary flex items-center gap-1"
                      >
                        {topic} <X className="w-3 h-3 ml-1" />
                      </button>
                    ))}
                  </div>
                  <div className="relative max-w-xs">
                    <input 
                      type="text" 
                      placeholder="Add custom topic + Enter" 
                      value={customTopic}
                      onChange={e => setCustomTopic(e.target.value)}
                      onKeyDown={handleCustomTopic}
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4">2. Choose your reading style</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STYLES.map(style => {
                      const isSelected = selectedStyle === style.id;
                      return (
                        <div 
                          key={style.id}
                          onClick={() => onStyleChange(style.id)}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg font-serif">{style.name}</h4>
                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{style.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t flex justify-end">
                <button 
                  onClick={onComplete}
                  disabled={!canStart}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                >
                  Start Reading
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
