/**
 * template/index.ts
 * Public API for the cron template module.
 */

import {
  createTemplate,
  renderTemplate,
  extractVariables,
  isTemplateComplete,
  CronTemplate,
  TemplateVariable,
} from './cronTemplate';

export { CronTemplate, TemplateVariable };

export function buildTemplate(name: string, template: string, description?: string): CronTemplate {
  return createTemplate(name, template, description);
}

export function fillTemplate(
  cronTemplate: CronTemplate,
  values: Record<string, string>
): string {
  return renderTemplate(cronTemplate, values);
}

export function getTemplateVariables(template: string): string[] {
  return extractVariables(template);
}

export function isReadyToRender(
  cronTemplate: CronTemplate,
  values: Record<string, string>
): boolean {
  return isTemplateComplete(cronTemplate, values);
}
