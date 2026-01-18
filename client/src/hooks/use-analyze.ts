import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AnalyzeInput, type AnalyzeResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAnalyze() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      // Validate input before sending using the shared schema
      const validated = api.analyze.input.parse(data);
      
      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
          throw new Error("Internal server error during analysis");
        }
        throw new Error("Failed to analyze URL");
      }
      
      return api.analyze.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path);
      if (!res.ok) throw new Error("Failed to fetch scan history");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}
