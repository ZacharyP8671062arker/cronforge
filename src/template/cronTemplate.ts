/**
 * cronTemplate.ts
 * Provides cron expression templating with variable substitution support.
 */

export interface TemplateVariable {
  name: string;
  value: string;
  description?: string;
}

export interface CronTemplate {
  name: string;
  template: string;
  variables: string[];
  description?: string;
}

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g;

export function extractVariables(template: string): string[] {
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  const regex = new RegExp(VARIABLE_PATTERN.source, 'g');
  while ((match = regex.exec(template)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

export function applyTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(VARIABLE_PATTERN, (_, key) => {
    if (!(key in variables)) {
      throw new Error(`Missing template variable: ${key}`);
    }
    return variables[key];
  });
}

export function createTemplate(
  name: string,
  template: string,
  description?: string
): CronTemplate {
  return {
    name,
    template,
    variables: extractVariables(template),
    description,
  };
}

export function renderTemplate(
  cronTemplate: CronTemplate,
  values: Record<string, string>
): string {
  const missing = cronTemplate.variables.filter((v) => !(v in values));
  if (missing.length > 0) {
    throw new Error(`Missing variables for template "${cronTemplate.name}": ${missing.join(', ')}`);
  }
  return applyTemplate(cronTemplate.template, values);
}

export function isTemplateComplete(
  cronTemplate: CronTemplate,
  values: Record<string, string>
): boolean {
  return cronTemplate.variables.every((v) => v in values && values[v].trim() !== '');
}
