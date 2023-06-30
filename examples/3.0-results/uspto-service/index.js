import { request } from '@request/uspto.request';

export const UsptoService = {
  get: {
    /**
     * List available data sets
     * - request: /#get
     * - tags: metadata
     * @param {object} options
     * @returns {Promise<dataSetList>}
     */
    async calling(options) {
      return await request({ pathname: '/', method: 'get', options });
    },
  },
  $dataset: {
    $version: {
      fields: {
        get: {
          /**
           * Provides the general information about the API and the list of fields that can be used to query the dataset.
           * @description This GET API returns the list of all the searchable field names that are in the oa_citations. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the syntax options shown below.
           * - request: /{dataset}/{version}/fields#get
           * - tags: metadata
           * @param {object} options
           * @param {object} options.path
           * @param {string} options.path.dataset - Name of the dataset.
           * @param {string} options.path.version - Version of the dataset.
           * @returns {Promise<string>}
           */
          async calling(options) {
            return await request({ pathname: '/{dataset}/{version}/fields', method: 'get', options });
          },
        },
      },
      records: {
        post: {
          /**
           * Provides search capability for the data set with the given search criteria.
           * @description This API is based on Solr/Lucene Search. The data is indexed using SOLR. This GET API returns the list of all the searchable field names that are in the Solr Index. Please see the 'fields' attribute which returns an array of field names. Each field or a combination of fields can be searched using the Solr/Lucene Syntax. Please refer https://lucene.apache.org/core/3_6_2/queryparsersyntax.html#Overview for the query syntax. List of field names that are searchable can be determined using above GET api.
           * - request: /{dataset}/{version}/records#post
           * - tags: search
           * @param {object} options
           * @param {object} options.path
           * @param {string} options.path.version - Version of the dataset.
           * @param {string} options.path.dataset - Name of the dataset. In this case, the default value is oa_citations
           * @param {object} options.body
           * @returns {Promise<object[]>}
           */
          async calling(options) {
            return await request({ pathname: '/{dataset}/{version}/records', method: 'post', options });
          },
        },
      },
    },
  },
};


/**
 * 
 * @typedef {object} dataSetList
 * @property {number} [total]
 * @property {object[]} [apis]
 * @property {string} [apis[].apiKey] - To be used as a dataset parameter value
 * @property {string} [apis[].apiVersionNumber] - To be used as a version parameter value
 * @property {string} [apis[].apiUrl] - The URL describing the dataset's fields
 * @property {string} [apis[].apiDocumentationUrl] - A URL to the API console for each API
 */