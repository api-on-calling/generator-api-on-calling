import { request } from '@request/api-with-examples.request';

export const ApiWithExamplesService = {
  get: {
    /**
     * List API versions
     * - request: /#get
     * @param {object} options
     */
    async calling(options) {
      return await request({ pathname: '/', method: 'get', options });
    },
  },
  v2: {
    get: {
      /**
       * Show API version details
       * - request: /v2#get
       * @param {object} options
       */
      async calling(options) {
        return await request({ pathname: '/v2', method: 'get', options });
      },
    },
  },
};
