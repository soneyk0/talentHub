import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		globals: true,
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/tests/e2e/**',
			'**/.{idea,git,cache,output,temp}/**',
		],
		coverage: {
			provider: 'v8',
			reportOnFailure: true,
			reportsDirectory: './coverage',
			include: ['components/**/*.vue', 'services/*.ts', 'composables/*.ts'],
			enabled: true,
		},
	},
});
