type ClassValue = string | undefined | null | false | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (values: ClassValue[]) => {
    for (const value of values) {
      if (Array.isArray(value)) walk(value);
      else if (typeof value === "string" && value.length > 0) out.push(value);
    }
  };
  walk(inputs);
  return out.join(" ");
}
