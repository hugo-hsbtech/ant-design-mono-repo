// Turborepo generator for scaffolding a new Next.js app under `apps/<name>`,
// pre-wired to the shared core (design-system, brand-tokens, shared configs,
// AntdRegistry + ThemeProvider + SSR cookie theme).
//
// Run with: `pnpm gen` → choose `app` → enter a name.
//
// Note: the param is typed as `any` to avoid pulling the `@turbo/gen` types into
// the build graph. The accurate type is `PlopTypes.NodePlopAPI` from '@turbo/gen'.
export default function generator(plop: any) {
  plop.setGenerator('app', {
    description: 'Cria um novo app Next.js em apps/<name> já conectado ao core da plataforma',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nome do app (pasta e package). Use minúsculas, números e hífens:',
        validate: (input: string) => {
          if (!input) return 'O nome é obrigatório.';
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input)) {
            return 'Use apenas minúsculas, números e hífens (ex.: meu-app).';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Descrição curta do app (package.json + metadata):',
        validate: (input: string) => (input ? true : 'A descrição é obrigatória.'),
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/apps/{{ name }}',
        base: 'templates',
        templateFiles: 'templates/**',
        // Strip the `.hbs` suffix from generated files.
        stripExtensions: ['hbs'],
        verbose: true,
      },
    ],
  });
}
