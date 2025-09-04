import { test as base } from '@playwright/test';
import { dismissCookieBanner } from './utils/helpers.js';

export const test = base.extend({
    page: async ({ page }, use) => {
        // Override goto to always dismiss cookie banner after navigation
        const originalGoto = page.goto.bind(page);
        page.goto = async (url, options) => {
            const response = await originalGoto(url, options);
            await dismissCookieBanner(page);
            return response;
        };

        await use(page);
    },
});

export { expect } from '@playwright/test';