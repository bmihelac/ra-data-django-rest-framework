import { AuthProvider, fetchUtils } from 'ra-core';

export interface Options {
  obtainAuthTokenUrl?: string;
}

function tokenAuthProvider(options: Options = {}): AuthProvider {
  const opts = {
    obtainAuthTokenUrl: '/api-token-auth/',
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
        localStorage.setItem('token', (await response.json()).token);
        localStorage.setItem('roles', (await response.json()).roles);
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
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      return Promise.resolve();
    },
    checkAuth: () =>
      localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),
    checkError: error => {
      const status = error.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        return Promise.reject();
      }
      return Promise.resolve();
    },
    getPermissions: () => {
      const roles = localStorage.getItem('roles');
      return localStorage.getItem('roles') ? Promise.resolve(roles) : Promise.reject();
    },
  };
}

export function createOptionsFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return {
    user: {
      authenticated: true,
      token: 'Token ' + token,
    },
  };
}

export function fetchJsonWithAuthToken(url: string, options: object) {
  console.log(options);
  return fetchUtils.fetchJson(
    url,
    Object.assign(createOptionsFromToken(), options)
  );
}

export default tokenAuthProvider;
