export function hasValidEmailPrefix(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0) return false;
  const prefix = trimmed.substring(0, atIndex);
  return prefix.includes('.');
}

export function filterEmails(rows: Record<string, string>[], columnName: string): {
  kept: Record<string, string>[];
  removed: Record<string, string>[];
} {
  const kept: Record<string, string>[] = [];
  const removed: Record<string, string>[] = [];

  for (const row of rows) {
    const email = row[columnName];
    if (hasValidEmailPrefix(email)) {
      kept.push(row);
    } else {
      removed.push(row);
    }
  }

  return { kept, removed };
}
