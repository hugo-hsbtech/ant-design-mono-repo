// The facade: re-export the full antd surface so apps import everything UI from
// `@repo/design-system` and never from `antd` directly. This is the single
// point where we can later swap defaults, add wrappers, or pin behavior.
//
// Note for Next.js App Router: import subcomponents by their named export
// (e.g. `Select` + `Select.Option` via the namespace), never deep paths.
export * from 'antd';
