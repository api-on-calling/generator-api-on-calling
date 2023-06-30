import { request } from '@request/link-example.request';

export const LinkExampleService = {
  '2.0': {
    users: {
      $username: {
        get: {
          /**
           * - request: /2.0/users/{username}#get
           * @param {object} options
           * @param {object} options.path
           * @param {string} options.path.username -
           * @returns {Promise<user>}
           */
          async calling(options) {
            return await request({ pathname: '/2.0/users/{username}', method: 'get', options });
          },
        },
      },
    },
    repositories: {
      $username: {
        get: {
          /**
           * - request: /2.0/repositories/{username}#get
           * @param {object} options
           * @param {object} options.path
           * @param {string} options.path.username -
           * @returns {Promise<repository[]>}
           */
          async calling(options) {
            return await request({ pathname: '/2.0/repositories/{username}', method: 'get', options });
          },
        },
        $slug: {
          get: {
            /**
             * - request: /2.0/repositories/{username}/{slug}#get
             * @param {object} options
             * @param {object} options.path
             * @param {string} options.path.username -
             * @param {string} options.path.slug -
             * @returns {Promise<repository>}
             */
            async calling(options) {
              return await request({ pathname: '/2.0/repositories/{username}/{slug}', method: 'get', options });
            },
          },
          pullrequests: {
            get: {
              /**
               * - request: /2.0/repositories/{username}/{slug}/pullrequests#get
               * @param {object} options
               * @param {object} options.path
               * @param {string} options.path.username -
               * @param {string} options.path.slug -
               * @param {object} options.query
               * @param {('open' | 'merged' | 'declined')} [options.query.state] -
               * @returns {Promise<pullrequest[]>}
               */
              async calling(options) {
                return await request({
                  pathname: '/2.0/repositories/{username}/{slug}/pullrequests',
                  method: 'get',
                  options,
                });
              },
            },
            $pid: {
              get: {
                /**
                 * - request: /2.0/repositories/{username}/{slug}/pullrequests/{pid}#get
                 * @param {object} options
                 * @param {object} options.path
                 * @param {string} options.path.username -
                 * @param {string} options.path.slug -
                 * @param {string} options.path.pid -
                 * @returns {Promise<pullrequest>}
                 */
                async calling(options) {
                  return await request({
                    pathname: '/2.0/repositories/{username}/{slug}/pullrequests/{pid}',
                    method: 'get',
                    options,
                  });
                },
              },
              merge: {
                post: {
                  /**
                   * - request: /2.0/repositories/{username}/{slug}/pullrequests/{pid}/merge#post
                   * @param {object} options
                   * @param {object} options.path
                   * @param {string} options.path.username -
                   * @param {string} options.path.slug -
                   * @param {string} options.path.pid -
                   */
                  async calling(options) {
                    return await request({
                      pathname: '/2.0/repositories/{username}/{slug}/pullrequests/{pid}/merge',
                      method: 'post',
                      options,
                    });
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};


/**
 * 
 * @typedef {object} user
 * @property {string} [username]
 * @property {string} [uuid]
 */

/**
 * 
 * @typedef {object} repository
 * @property {string} [slug]
 * @property {user} [owner]
 */

/**
 * 
 * @typedef {object} pullrequest
 * @property {number} [id]
 * @property {string} [title]
 * @property {repository} [repository]
 * @property {user} [author]
 */