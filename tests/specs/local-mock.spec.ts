import { test, expect } from '../fixtures';

test.describe('Local front-end integration', () => {
  test('mocks a local API response from client-side fetch', async ({ mockHelper }) => {
    const mockData = { name: 'Demo User', role: 'tester' };
    await mockHelper.setupUserProfileMock(mockData);

    const result = await mockHelper.navigateAndFetch('/', '/api/user-profile');
    expect(result).toEqual(mockData);
  });
});
