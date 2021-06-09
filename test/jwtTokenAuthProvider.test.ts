import 'cross-fetch/polyfill';
import fetchMock from 'fetch-mock-jest';

import jwtTokenAuthProvider, {
  createOptionsFromJWTToken,
  fetchJsonWithAuthJWTToken,
} from '../src/jwtTokenAuthProvider';

fetchMock.config.overwriteRoutes = true;

describe('login', () => {
  const LOGIN_DATA = {
    username: 'foo',
    password: 'example',
  };

  it('should throw error with statusText for non json responses', async () => {
    fetchMock.post('/api/token/', () => {
      return 404;
    });
    await expect(jwtTokenAuthProvider().login(LOGIN_DATA)).rejects.toThrow(
      'Not Found'
    );
  });

  it('should throw error with non_field_errors', async () => {
    const error = 'Unable to log in with provided credentials.';
    fetchMock.post('/api/token/', {
      body: {
        non_field_errors: [error],
      },
      status: 400,
    });
    await expect(jwtTokenAuthProvider().login(LOGIN_DATA)).rejects.toThrow(
      error
    );
  });

  it('should set token when successfull', async () => {
    const access = 'abcdef';
    fetchMock.post('/api/token/', {
      body: { access },
    });
    await jwtTokenAuthProvider().login(LOGIN_DATA);
    expect(localStorage.getItem('access')).toBe(access);
  });
});

describe('logout', () => {
  it('should remove token', async () => {
    localStorage.setItem('access', 'abcdef');
    await jwtTokenAuthProvider().logout({});
  });
});

describe('checkAuth', () => {
  it('should return resolve when token exists', async () => {
    localStorage.setItem('access', 'abcdef');
    await expect(jwtTokenAuthProvider().checkAuth({})).resolves.toBeUndefined();
  });
  it('should return reject when token does not exists', async () => {
    localStorage.clear();
    await expect(jwtTokenAuthProvider().checkAuth({})).rejects.toBeUndefined();
  });
});

describe('checkError', () => {
  it('should remove token and reject for 401 or 403 error', async () => {
    [401, 403].forEach(async status => {
      await expect(
        jwtTokenAuthProvider().checkError({ status })
      ).rejects.toBeUndefined();
    });
  });
  it('should resolve on other errors', async () => {
    await expect(
      jwtTokenAuthProvider().checkError({ status: 500 })
    ).resolves.toBeUndefined();
  });
});

describe('getPermissions', () => {
  it.todo('missing implementation');
});

describe('createOptionsFromJWTToken', () => {
  test('with token', () => {
    localStorage.setItem('access', 'abcdef');
    expect(createOptionsFromJWTToken()).toEqual({
      user: {
        authenticated: true,
        token: 'Bearer abcdef',
      },
    });
  });

  test('without token', () => {
    localStorage.clear();
    expect(createOptionsFromJWTToken()).toEqual({});
  });
});

describe('fetchJsonWithAuthJWTToken', function() {
  fetchMock.patch('/', 200);
  test('with options', () => {
    fetchJsonWithAuthJWTToken('/', {
      method: 'PATCH',
    });
  });
});
