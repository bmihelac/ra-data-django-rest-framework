# ra-data-django-rest-framework

[react-admin](https://marmelab.com/react-admin/) data and authentication provider for [Django REST
framework](https://www.django-rest-framework.org/).

[![Stable Release](https://img.shields.io/npm/v/ra-data-django-rest-framework)](https://npm.im/ra-data-django-rest-framework)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
![CI](https://github.com/bmihelac/ra-data-django-rest-framework/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/bmihelac/ra-data-django-rest-framework/branch/master/graph/badge.svg)](https://codecov.io/gh/bmihelac/ra-data-django-rest-framework)

ra-data-django-rest-framework includes backend and client example application
and tests.

<p align="center">
  <img src="https://github.com/bmihelac/ra-data-django-rest-framework/blob/master/docs/ra-data-django-rest-framework.png" alt="ra-data-django-rest-framework" />
</p>

## Install

```bash
npm install ra-data-django-rest-framework
```

## Usage

```javascript
import drfProvider from 'ra-data-django-rest-framework';
const dataProvider = drfProvider("/api");
```

## Features

* Sorting
* Pagination
* Filtering
* Authentication

### Sorting

Ordering for
[OrderingFilter](https://www.django-rest-framework.org/api-guide/filtering/#orderingfilter)
is supported.

### Pagination

Currently pagination with
[PageNumberPagination](https://www.django-rest-framework.org/api-guide/pagination/#pagenumberpagination)
is supported.

Default `PageNumberPagination` has `page_size_query_param` set to `None`,
overide to be able to set *Rows per page*, ie:

```python
from rest_framework.pagination import PageNumberPagination


class PageNumberWithPageSizePagination(PageNumberPagination):
    page_size_query_param = 'page_size'
```

### Filtering

ra-data-django-rest-framework supports:

* [Generic Filtering](https://www.django-rest-framework.org/api-guide/filtering/#generic-filtering)
* [DjangoFilterBackend](https://www.django-rest-framework.org/api-guide/filtering/#djangofilterbackend)

### Authentication

#### tokenAuthProvider

`tokenAuthProvider` uses
[TokenAuthentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
to obtain token from django-rest-framework. User token is saved in `localStorage`.

`tokenAuthProvider` accepts options as second argument with
`obtainAuthTokenUrl` key. Default URL for obtaining a token is `/api-token-auth/`.

`fetchJsonWithAuthToken` overrides *httpClient* and adds authorization header
with previously saved user token to every request.

```javascrtipt
import drfProvider, { tokenAuthProvider, fetchJsonWithAuthToken } from 'ra-data-django-rest-framework';

const authProvider = tokenAuthProvider()
const dataProvider = drfProvider("/api", fetchJsonWithAuthToken);
```

## Example app

### Django application with django-rest-framework

Setup virtual envirnoment, install requirements and load initial data:

```bash
cd example/backend
virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
./manage.py migrate
./manage.py loaddata initial
```

Run server:

```bash
./manage.py runserver
```

Admin credentials in the example app are:

`admin`
`password`

### React-admin demo application

```bash
yarn install # install ra-data-django-rest-framework
cd example/client
yarn install
yarn start
```

You can now view example app in the browser: http://localhost:3000
Login with user `admin`, password is `password` or create new users in Django
admin dashboard or shell.

## Contributing

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
All features that TSDX provides should work here too.

```bash
yarn start
```

```bash
yarn test
```

## TODO

* examples for image upload
