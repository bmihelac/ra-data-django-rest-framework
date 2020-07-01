import 'cross-fetch/polyfill';
import fetchMock from 'fetch-mock-jest';

import tokenAuthProvider, {
  createOptionsFromToken,
  fetchJsonWithAuthToken,
} from '../src/tokenAuthProvider';

fetchMock.config.overwriteRoutes = true;

describe('login', () => {
  const LOGIN_DATA = {
    username: 'foo',
    password: 'example',
  };

  it('should throw error with statusText for non json responses', async () => {
    fetchMock.post('/api-token-auth/', () => {
      return 404;
    });
    await expect(tokenAuthProvider().login(LOGIN_DATA)).rejects.toThrow(
      'Not Found'
    );
  });

  it('should throw error with non_field_errors', async () => {
    const error = 'Unable to log in with provided credentials.';
    fetchMock.post('/api-token-auth/', {
      body: {
        non_field_errors: [error],
      },
      status: 400,
    });
    await expect(tokenAuthProvider().login(LOGIN_DATA)).rejects.toThrow(error);
  });

  it('should set token when successfull', async () => {
    const token = 'abcdef';
    fetchMock.post('/api-token-auth/', {
      body: { token },
    });
    await tokenAuthProvider().login(LOGIN_DATA);
    expect(localStorage.getItem('token')).toBe(token);
  });
});

describe('logout', () => {
  it('should remove token', async () => {
    localStorage.setItem('token', 'abcdef');
    await tokenAuthProvider().logout({});
  });
});

describe('checkAuth', () => {
  it('should return resolve when token exists', async () => {
    localStorage.setItem('token', 'abcdef');
    await expect(tokenAuthProvider().checkAuth({})).resolves.toBeUndefined();
  });
  it('should return reject when token does not exists', async () => {
    localStorage.clear();
    await expect(tokenAuthProvider().checkAuth({})).rejects.toBeUndefined();
  });
});

describe('checkError', () => {
  it('should remove token and reject for 401 or 403 error', async () => {
    [401, 403].forEach(async status => {
      await expect(
        tokenAuthProvider().checkError({ status })
      ).rejects.toBeUndefined();
    });
  });
  it('should resolve on other errors', async () => {
    await expect(
      tokenAuthProvider().checkError({ status: 500 })
    ).resolves.toBeUndefined();
  });
});

describe('getPermissions', () => {
  it.todo('missing implementation');
});

describe('createOptionsFromToken', () => {
  test('with token', () => {
    localStorage.setItem('token', 'abcdef');
    expect(createOptionsFromToken()).toEqual({
      user: {
        authenticated: true,
        token: 'Token abcdef',
      },
    });
  });

  test('without token', () => {
    localStorage.clear();
    expect(createOptionsFromToken()).toEqual({});
  });
});

describe('fetchJsonWithAuthToken', function() {
  fetchMock.patch('/', 200);
  test('with options', () => {
    fetchJsonWithAuthToken('/', {
      method: 'PATCH',
    });
  });
});
