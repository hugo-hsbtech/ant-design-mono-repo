import { describe, it, expect } from 'vitest';
import {
  listProjects,
  createProject,
  deleteProject,
  listOrgsForUser,
  inviteMember,
  listMembers,
  listInvites,
  updateMemberRole,
  removeMember,
  countOwners,
  updateOrg,
  getOrgBySlug,
} from './data';

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

describe('member management', () => {
  it('adds a known email directly and lists the member', () => {
    const res = inviteMember('o_hermes', 'grace@plataforma.dev', 'member');
    expect(res.status).toBe('added');
    expect(listMembers('o_hermes').some((m) => m.user.email === 'grace@plataforma.dev')).toBe(true);
  });

  it('records a pending invite for an unknown email, scoped by org', () => {
    const res = inviteMember('o_hermes', 'new@example.com', 'admin');
    expect(res.status).toBe('invited');
    expect(listInvites('o_hermes').some((i) => i.email === 'new@example.com')).toBe(true);
    expect(listInvites('o_apollo').some((i) => i.email === 'new@example.com')).toBe(false);
  });

  it('updates roles and removes members', () => {
    updateMemberRole('o_hermes', 'u_grace', 'admin');
    expect(listMembers('o_hermes').find((m) => m.userId === 'u_grace')?.role).toBe('admin');
    removeMember('o_hermes', 'u_grace');
    expect(listMembers('o_hermes').some((m) => m.userId === 'u_grace')).toBe(false);
  });

  it('counts owners (for the last-owner guard)', () => {
    expect(countOwners('o_apollo')).toBe(1);
    expect(countOwners('o_hermes')).toBe(0);
  });

  it('updates org settings', () => {
    updateOrg('o_hermes', { name: 'Hermes Inc.' });
    expect(getOrgBySlug('hermes')?.name).toBe('Hermes Inc.');
  });
});
