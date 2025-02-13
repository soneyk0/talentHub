import { expect, test } from '@playwright/test';

test.describe('Login form', () => {
	const loginUrl = 'http://localhost:3000/auth/login';
	test.beforeEach(async ({ page }) => {
		await page.goto(loginUrl);
	});
	test('should display email and password fields', async ({ page }) => {
		const emailInput = await page.locator('#email');
		const passwordInput = await page.locator('#password');

		await expect(emailInput).toBeVisible();
		await expect(passwordInput).toBeVisible();
	});

	test('should show validation error for empty email and password', async ({
		page,
	}) => {
		const loginButton = await page.locator('button[type="submit"]');
		await loginButton.click();

		const emailError = await page.locator('span.text-red-1').first();
		const passwordError = await page.locator('span.text-red-1').nth(1);

		await expect(emailError).toHaveText('Required field');
		await expect(passwordError).toHaveText('Required field');
	});

	test('should navigate to users page on successful login', async ({
		page,
	}) => {
		await page.locator('#email').fill('example@gmail.com'); // write your email
		await page.locator('#password').fill('password'); // write your password

		await page.locator('button[type="submit"]').click();

		await expect(page).toHaveURL('http://localhost:3001/users');
	});

	test('should navigate to forgot password form', async ({ page }) => {
		await page.locator('button[type="button"]').click();

		await expect(page).toHaveURL('http://localhost:3000/auth/forgot-password');
	});
});
