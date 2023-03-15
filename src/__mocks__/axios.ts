const create = jest.fn(() => ({ interceptors: { request: { use: jest.fn() } } }));

const axios = { create };

export default axios;
