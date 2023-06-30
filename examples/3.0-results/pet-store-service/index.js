import { request } from '@request/petstore.request';

export const PetStoreService = {
  pets: {
    get: {
      /**
       * List all pets
       * - request: /pets#get
       * - tags: pets
       * @param {object} options
       * @param {object} options.query
       * @param {number} [options.query.limit] - How many items to return at one time (max 100)
       * @returns {Promise<Pets>}
       */
      async calling(options) {
        return await request({ pathname: '/pets', method: 'get', options });
      },
    },
    post: {
      /**
       * Create a pet
       * - request: /pets#post
       * - tags: pets
       * @param {object} options
       */
      async calling(options) {
        return await request({ pathname: '/pets', method: 'post', options });
      },
    },
    $petId: {
      get: {
        /**
         * Info for a specific pet
         * - request: /pets/{petId}#get
         * - tags: pets
         * @param {object} options
         * @param {object} options.path
         * @param {string} options.path.petId - The id of the pet to retrieve
         * @returns {Promise<Pet>}
         */
        async calling(options) {
          return await request({ pathname: '/pets/{petId}', method: 'get', options });
        },
      },
    },
  },
};


/**
 * 
 * @typedef {object} Pet
 * @property {number} id
 * @property {string} name
 * @property {string} [tag]
 */

/**
 * 
 * @typedef {Pet[]} Pets
 */

/**
 * 
 * @typedef {object} Error
 * @property {number} code
 * @property {string} message
 */