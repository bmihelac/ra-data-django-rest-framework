import { AuthProvider, fetchUtils } from 'ra-core';

export interface Options {
  obtainAuthTokenUrl?: string;
}

function jwtTokenAuthProvider(options: Options = {}): AuthProvider {
  const opts = {
    obtainAuthTokenUrl: '/api/token/',
    ...options,
  };
  return {
    login: async ({ username, password }) => {
      const request = new Request(opts.obtainAuthTokenUrl, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      const response = await fetch(request);
      if (response.ok) {
        const responseJSON = await response.json();
        localStorage.setItem('access', responseJSON.access);
        localStorage.setItem('refresh', responseJSON.refresh);
        return;
      }
      if (response.headers.get('content-type') !== 'application/json') {
        throw new Error(response.statusText);
      }

      const json = await response.json();
      const error = json.non_field_errors;
      throw new Error(error || response.statusText);
    },
    logout: () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      return Promise.resolve();
    },
    checkAuth: () =>
      localStorage.getItem('access') ? Promise.resolve() : Promise.reject(),
    checkError: error => {
      const status = error.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject();
      }
      return Promise.resolve();
    },
    getPermissions: () => {
      return Promise.resolve();
    },
  };
}

export function createOptionsFromJWTToken() {
  const token = localStorage.getItem('access');
  if (!token) {
    return {};
  }
  return {
    user: {
      authenticated: true,
      token: 'Bearer ' + token,
    },
  };
}

export function fetchJsonWithAuthJWTToken(url: string, options: object) {
  return fetchUtils.fetchJson(
    url,
    Object.assign(createOptionsFromJWTToken(), options)
  );
}

export default jwtTokenAuthProvider;
