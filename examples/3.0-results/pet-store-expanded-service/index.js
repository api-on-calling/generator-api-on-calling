import { request } from '@request/petstore-expanded.request';

export const PetStoreExpandedService = {
  pets: {
    get: {
      /**
       * @description Returns all pets from the system that the user has access to
       * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
       *
       * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
       *
       * - request: /pets#get
       * @param {object} options
       * @param {object} options.query
       * @param {number} [options.query.limit] - maximum number of results to return
       * @returns {Promise<Pet[]>}
       */
      async calling(options) {
        return await request({ pathname: '/pets', method: 'get', options });
      },
    },
    post: {
      /**
       * @description Creates a new pet in the store. Duplicates are allowed
       * - request: /pets#post
       * @param {object} options
       * @param {NewPet} options.body
       * @returns {Promise<Pet>}
       */
      async calling(options) {
        return await request({ pathname: '/pets', method: 'post', options });
      },
    },
    $id: {
      get: {
        /**
         * @description Returns a user based on a single ID, if the user does not have access to the pet
         * - request: /pets/{id}#get
         * @param {object} options
         * @param {object} options.path
         * @param {number} options.path.id - ID of pet to fetch
         * @returns {Promise<Pet>}
         */
        async calling(options) {
          return await request({ pathname: '/pets/{id}', method: 'get', options });
        },
      },
      delete: {
        /**
         * @description deletes a single pet based on the ID supplied
         * - request: /pets/{id}#delete
         * @param {object} options
         * @param {object} options.path
         * @param {number} options.path.id - ID of pet to delete
         */
        async calling(options) {
          return await request({ pathname: '/pets/{id}', method: 'delete', options });
        },
      },
    },
  },
};


/**
 * 
 * @typedef {object} Pet
 * @property {string} name
 * @property {string} [tag]
 * @property {number} id
 */

/**
 * 
 * @typedef {object} NewPet
 * @property {string} name
 * @property {string} [tag]
 */

/**
 * 
 * @typedef {object} Error
 * @property {number} code
 * @property {string} message
 */