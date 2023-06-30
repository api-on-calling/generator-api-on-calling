import { request } from '@request/callback-example.request';

export const CallbackExampleService = {
  streams: {
    post: {
      /**
* @description subscribes a client to receive out-of-band data
* - request: /streams#post
* @param {object} options
* @param {object} options.query
* @param {string} options.query.callbackUrl - the location where data will be sent.  Must be network accessible
by the source server

*/
      async calling(options) {
        return await request({ pathname: '/streams', method: 'post', options });
      },
    },
  },
};
