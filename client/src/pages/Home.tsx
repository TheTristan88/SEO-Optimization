import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAnalyze } from "@/hooks/use-analyze";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreCard } from "@/components/ScoreCard";
import { GooglePreview } from "@/components/GooglePreview";
import { SocialPreview } from "@/components/SocialPreview";
import { IssuesList } from "@/components/IssuesList";
import { TechDetails } from "@/components/TechDetails";
import { Search, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL including http:// or https://"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { mutate, isPending, data, error, reset } = useAnalyze();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  const onSubmit = (values: FormValues) => {
    setHasAnalyzed(true);
    mutate(values);
  };

  const handleReset = () => {
    setHasAnalyzed(false);
    reset();
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh font-sans">
      {/* Header / Nav */}
      <header className="border-b border-border/40 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">MetaMaster</span>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 pb-24">
        {/* Hero Section */}
        <motion.div 
          layout
          className={`max-w-3xl mx-auto text-center transition-all duration-500 ${hasAnalyzed ? 'mb-12' : 'mb-24 mt-12'}`}
        >
          <motion.h1 
            layout="position"
            className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight"
          >
            Optimize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">SEO Tags</span> in seconds.
          </motion.h1>
          
          <AnimatePresence>
            {!hasAnalyzed && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="text-lg text-muted-foreground mb-8 text-balance"
              >
                Instant feedback on your Title tags, Meta descriptions, Open Graph images, and structure. Ensure your site looks perfect on Google and Social Media.
              </motion.p>
            )}
          </AnimatePresence>

          <div className="max-w-xl mx-auto relative">
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10">
              <div className="relative flex items-center">
                <Input
                  {...form.register("url")}
                  placeholder="https://example.com"
                  className="h-14 pl-12 pr-32 rounded-2xl border-2 border-border focus:border-primary shadow-lg shadow-primary/5 text-lg bg-card"
                  disabled={isPending}
                />
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <div className="absolute right-2 top-2 bottom-2">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isPending}
                    className="h-full rounded-xl px-6 font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    {isPending ? "Scanning..." : "Analyze"}
                  </Button>
                </div>
              </div>
              {form.formState.errors.url && (
                <p className="text-red-500 text-sm mt-2 text-left ml-2 font-medium">
                  {form.formState.errors.url.message}
                </p>
              )}
            </form>
          </div>
        </motion.div>

        {/* Loading State */}
        {isPending && (
          <div className="max-w-5xl mx-auto mt-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
            <div className="h-96 rounded-2xl bg-secondary/50 animate-pulse" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Analysis Failed</h3>
            <p className="text-red-700 mb-6">{error.message}</p>
            <Button variant="outline" onClick={handleReset} className="border-red-200 hover:bg-red-100 text-red-700">
              Try Another URL
            </Button>
          </motion.div>
        )}

        {/* Results Dashboard */}
        {data && !isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                  <p className="text-muted-foreground text-sm">{data.url}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                Analyze New URL <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Row: Score & Stats */}
              <div className="lg:col-span-4">
                <ScoreCard data={data} />
              </div>
              
              <div className="lg:col-span-8">
                <IssuesList data={data} />
              </div>

              {/* Middle Row: Visual Previews */}
              <div className="lg:col-span-6">
                <GooglePreview data={data} />
              </div>
              <div className="lg:col-span-6">
                <SocialPreview data={data} />
              </div>

              {/* Bottom Row: Technical Data */}
              <div className="lg:col-span-12">
                <TechDetails data={data} />
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
