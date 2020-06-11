import DataProvider, { getOrderingQuery } from '../src';

const TEST_URL = 'http://example.com';
const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 10,
};
const DEFAULT_FILTER = {};
const DEFAULT_ORDERING = {
  field: 'id',
  order: 'ASC',
};
const DEFAULT_LIST_PARAMS = {
  filter: DEFAULT_FILTER,
  sort: DEFAULT_ORDERING,
  pagination: DEFAULT_PAGINATION,
};
const DEFAULT_RESPONSE = {
  status: 200,
  headers: {},
  body: '',
  json: {},
};
const mockDataProvider = (json = {}) => {
  const httpClient = jest.fn(() =>
    Promise.resolve({
      ...DEFAULT_RESPONSE,
      json,
    })
  );
  return {
    dataProvider: DataProvider(TEST_URL, httpClient),
    httpClient,
  };
};

describe('getOrderingQuery', function() {
  it('should work', function() {
    expect(getOrderingQuery({ ...DEFAULT_ORDERING, order: 'DESC' })).toEqual({
      ordering: '-id',
    });
  });
});

describe('dataProvider', () => {
  const item = {
    id: 4,
    username: 'user1',
    email: '',
  };

  describe('getList', function() {
    it('should create proper URL', () => {
      const { dataProvider, httpClient } = mockDataProvider();
      dataProvider.getList('posts', {
        sort: { field: 'id', order: 'ASC' },
        filter: {},
        pagination: {
          page: 1,
          perPage: 10,
        },
      });
      expect(httpClient).toHaveBeenCalledWith(
        'http://example.com/posts/?ordering=id&page=1&page_size=10'
      );
    });

    it('should return data', async () => {
      const { dataProvider } = mockDataProvider({
        results: [item],
        count: 1,
      });
      expect(await dataProvider.getList('posts', DEFAULT_LIST_PARAMS)).toEqual({
        data: [item],
        total: 1,
      });
    });
  });

  describe('getOne', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(await dataProvider.getOne('posts', { id: item.id })).toEqual({
        data: item,
      });
    });
  });

  describe('getMany', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(await dataProvider.getMany('posts', { ids: [item.id] })).toEqual({
        data: [item],
      });
    });
  });

  describe('getManyReference', function() {
    it('should create proper URL', () => {
      const { dataProvider, httpClient } = mockDataProvider();
      dataProvider.getManyReference('posts', {
        filter: DEFAULT_FILTER,
        sort: DEFAULT_ORDERING,
        pagination: DEFAULT_PAGINATION,
        target: 'id',
        id: 4,
      });
      expect(httpClient).toHaveBeenCalledWith(
        'http://example.com/posts/?id=4&ordering=id&page=1&page_size=10'
      );
    });
  });

  describe('update', function() {
    it('should create proper request', () => {
      const { dataProvider, httpClient } = mockDataProvider();
      const updatedItem = {
        ...item,
        username: 'updated username',
      };
      dataProvider.update('posts', {
        id: item.id,
        data: updatedItem,
        previousData: item,
      });
      expect(httpClient).toHaveBeenCalledWith(
        `http://example.com/posts/${item.id}/`,
        {
          method: 'PATCH',
          body: JSON.stringify(updatedItem),
        }
      );
    });
  });

  describe('updateMany', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(
        await dataProvider.updateMany('posts', {
          ids: [item.id],
          data: { username: 'foo' },
        })
      ).toEqual({
        data: [item.id],
      });
    });
  });

  describe('create', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(await dataProvider.create('posts', { data: item })).toEqual({
        data: item,
      });
    });
  });

  describe('delete', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(
        await dataProvider.delete('posts', { id: item.id, previousData: item })
      ).toEqual({ data: item });
    });
  });

  describe('deleteMany', function() {
    it('should return data', async () => {
      const { dataProvider } = mockDataProvider(item);
      expect(
        await dataProvider.deleteMany('posts', { ids: [item.id] })
      ).toEqual({
        data: [item.id],
      });
    });
  });
});
