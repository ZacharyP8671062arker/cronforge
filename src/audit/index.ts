import { auditCron, auditFrequency, assessRisk } from './cronAudit';

export type AuditLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AuditSummary {
  expression: string;
  valid: boolean;
  riskLevel: AuditLevel;
  frequencyLabel: string;
  warnings: string[];
  suggestions: string[];
}

/**
 * Returns a full audit summary for a cron expression.
 */
export function getAuditSummary(expression: string): AuditSummary {
  const result = auditCron(expression);
  return {
    expression,
    valid: result.valid,
    riskLevel: result.riskLevel as AuditLevel,
    frequencyLabel: result.frequencyLabel,
    warnings: result.warnings,
    suggestions: result.suggestions,
  };
}

/**
 * Returns true if the cron expression is considered high or critical risk.
 */
export function isHighRisk(expression: string): boolean {
  const risk = assessRisk(expression);
  return risk === 'high' || risk === 'critical';
}

/**
 * Returns a human-readable frequency label for the cron expression.
 */
export function describeFrequency(expression: string): string {
  return auditFrequency(expression);
}

/**
 * Returns all warnings detected for the cron expression.
 */
export function getAuditWarnings(expression: string): string[] {
  const result = auditCron(expression);
  return result.warnings;
}
