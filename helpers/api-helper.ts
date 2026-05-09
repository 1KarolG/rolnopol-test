import type { APIRequestContext } from '@playwright/test';
import { demoUsers } from '../test-data/users';

/**
 * API test helper class
 * Encapsulates common API test operations
 */
export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async getOpenAPISchema() {
    const response = await this.request.get('/schema/openapi.json');
    if (!response.ok()) {
      throw new Error(`Failed to fetch OpenAPI schema: ${response.status()}`);
    }
    return response.json();
  }

  async checkHealthcheck() {
    const response = await this.request.get('/api/v1/healthcheck');
    return {
      ok: response.ok(),
      status: response.status(),
      body: response.ok() ? await response.json() : null,
    };
  }

  async loginWithCredentials(email: string, password: string) {
    const response = await this.request.post('/api/v1/login', {
      data: { email, password },
    });

    return {
      ok: response.ok(),
      status: response.status(),
      body: await response.json(),
    };
  }

  async loginWithValidUser() {
    return this.loginWithCredentials(demoUsers.developer.email, demoUsers.developer.password);
  }

  async loginWithInvalidCredentials() {
    return this.loginWithCredentials(demoUsers.invalid.email, demoUsers.invalid.password);
  }
}
