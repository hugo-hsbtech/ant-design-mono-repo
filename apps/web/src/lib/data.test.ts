import { describe, it, expect } from 'vitest';
import { listProjects, createProject, deleteProject, listOrgsForUser } from './data';

describe('multi-tenant data layer', () => {
  it('scopes project queries by org (no cross-tenant leakage)', () => {
    const apollo = listProjects('o_apollo');
    const hermes = listProjects('o_hermes');
    expect(apollo.every((p) => p.orgId === 'o_apollo')).toBe(true);
    expect(hermes.every((p) => p.orgId === 'o_hermes')).toBe(true);
    expect(apollo.some((p) => p.orgId === 'o_hermes')).toBe(false);
  });

  it('creates and deletes within a single tenant', () => {
    const before = listProjects('o_hermes').length;
    const created = createProject('o_hermes', 'Hermes Web');
    expect(listProjects('o_hermes')).toHaveLength(before + 1);
    // A delete scoped to another tenant must NOT remove this org's row.
    deleteProject('o_apollo', created.id);
    expect(listProjects('o_hermes').some((p) => p.id === created.id)).toBe(true);
    // Correct tenant can delete it.
    deleteProject('o_hermes', created.id);
    expect(listProjects('o_hermes')).toHaveLength(before);
  });

  it('lists only the orgs a user belongs to', () => {
    expect(listOrgsForUser('u_ada').map((o) => o.slug).sort()).toEqual(['apollo', 'hermes']);
    expect(listOrgsForUser('u_alan').map((o) => o.slug)).toEqual(['apollo']);
  });
});
