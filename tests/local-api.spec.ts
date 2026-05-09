import { test, expect } from '../fixtures/fixtures';

test.describe('Local API', () => {
  test('OpenAPI schema is reachable and documents login and healthcheck', async ({
    apiHelper,
  }) => {
    const swagger = await apiHelper.getOpenAPISchema();
    expect(swagger.openapi).toBe('3.0.0');
    expect(swagger.paths).toHaveProperty('/login');
    expect(swagger.paths).toHaveProperty('/healthcheck');
  });

  test('healthcheck endpoint returns 200 for healthy service', async ({ apiHelper }) => {
    const result = await apiHelper.checkHealthcheck();
    expect(result.status).toBe(200);
    expect(result.ok).toBeTruthy();
  });

  test('login API accepts valid credentials and returns a token', async ({ apiHelper }) => {
    const result = await apiHelper.loginWithValidUser();
    expect(result.ok).toBeTruthy();
    expect(result.body.success).toBe(true);
    expect(result.body.data?.token).toBeTruthy();
  });
});
