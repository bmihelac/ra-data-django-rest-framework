# ra-data-django-rest-framework

[react-admin](https://marmelab.com/react-admin/) data provider for [Django REST
framework](https://www.django-rest-framework.org/).

[![Stable Release](https://img.shields.io/npm/v/ra-data-django-rest-framework)](https://npm.im/ra-data-django-rest-framework)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
![CI](https://github.com/bmihelac/ra-data-django-rest-framework/workflows/CI/badge.svg)

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

django-rest-framework browsable api is available on http://localhost:8000/api/

### React-admin demo application

```bash
yarn install # install ra-data-django-rest-framework
cd example/client
yarn install
yarn start
```

You can now view example app in the browser: http://localhost:3000

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
