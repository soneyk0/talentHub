import { defineVitestConfig } from '@nuxt/test-utils/config';
export default defineVitestConfig({
	// plugins: [vue()],
	test: {
		environment: 'nuxt',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
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
			include: [
				'components/**/*.vue',
				'services/*.ts',
				'composables/*.ts',
				'layouts/*.vue',
			],
			enabled: true,
		},
	},
});
