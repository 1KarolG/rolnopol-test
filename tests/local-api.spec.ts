import { expect, test } from '../fixtures/fixtures';
import { API_ASSERTIONS, API_ENDPOINTS, HTTP_STATUS } from '../const/assertions';

test.describe('Local API', () => {
  test('OpenAPI schema is reachable and documents login and healthcheck', async ({ apiHelper }) => {
    const swagger = await apiHelper.getOpenAPISchema();
    expect(swagger.openapi).toBe(API_ASSERTIONS.OPENAPI_VERSION);
    expect(swagger.paths).toHaveProperty(API_ENDPOINTS.LOGIN);
    expect(swagger.paths).toHaveProperty(API_ENDPOINTS.HEALTHCHECK);
  });

  test('healthcheck endpoint returns 200 for healthy service', async ({ apiHelper }) => {
    const result = await apiHelper.checkHealthcheck();
    expect(result.status).toBe(HTTP_STATUS.OK);
    expect(result.ok).toBeTruthy();
  });

  test('login API accepts valid credentials and returns a token', async ({ apiHelper }) => {
    const result = await apiHelper.loginWithValidUser();
    expect(result.ok).toBeTruthy();
    expect(result.body.success).toBe(API_ASSERTIONS.SUCCESS_STATUS);
    expect(result.body.data?.token).toBeTruthy();
  });
});
