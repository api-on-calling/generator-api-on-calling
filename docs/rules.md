# Rules to be followed by your backend teamates

To be honestly, I am not an expert on the OpenAPI Spec V3.0.3, all my work to do is only translate the OpenAPI document examples I know(only some examples), and make sure the generated request client is right.

And if you follow the rules below, I will make a promise to generate a nice and useful api service for you, with jsdoc under the api service.

1. only 3 data types on parameters(pathname or querystring): string, integer, boolean

- the float numbers might lose accuracy when transformed to string on javascript, like 3.141592612312312323232323 -> '3.141592612312312'

- object or array should not be shown on the pathname or querystring, as they might not understood by different backend parsers, putting them on the request body would be a smart action.

- an alternative way for the collection data(like array, some list) is using comma, e.g. 1,2,3 -> \[1,2,3]

- using 0 or 1 for boolean value(I advise), as it is often replaced with tinyint *0*, *1* in databse

2. using *$ref* on request body content schema or response body content schema

3. define all your class schemas on *openapi_document*.schemas.contents

4. always use named class definitions for object, do not define anonymous object type for schema.
