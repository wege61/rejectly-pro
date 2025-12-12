export interface ExperienceTools {
  experienceIndex: number;
  title: string;
  company: string;
  dates: string;
  existingTools: string[];
  suggestedTools: ToolSuggestion[];
}

export interface ToolSuggestion {
  name: string;
  category: string;
  reason: string;
  priority: "high" | "medium" | "low";
  source: "job_posting" | "industry_standard" | "related_skill";
}

export interface ToolSuggestionResponse {
  experiences: ExperienceTools[];
  globalSuggestions: ToolSuggestion[];
}

export interface SelectedTools {
  [experienceIndex: number]: string[];
  global: string[];
}
