'use client';
import { createContext, useContext } from 'react';
import type { Org, Role } from '@/lib/types';

export interface OrgContextValue {
  org: Org;
  role: Role;
  /** Orgs the current user belongs to (for the OrgSwitcher). */
  orgs: Org[];
  user: { id: string; name?: string | null; email?: string | null };
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({
  value,
  children,
}: {
  value: OrgContextValue;
  children: React.ReactNode;
}) {
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

/** Current org, the caller's role, and their org list. Client-side only. */
export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within <OrgProvider>');
  return ctx;
}
