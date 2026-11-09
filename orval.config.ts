import { defineConfig } from 'orval'

export default defineConfig({
  emprestai: {
    input: './docs/openapi.json',
    output: {
      target: './src/generated/emprestai.ts',
      client: 'fetch',
      override: {
        mutator: { path: './src/api-request.ts', name: 'apiRequest' },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
})
