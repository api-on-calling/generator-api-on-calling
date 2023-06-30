# examples-commands

cmd line tool: unix like, e.g. iTerm2, Git Shell ...

## prepare the env

1. install http-server (if you already have got a server tool, you can skip this step)

```sh
npm install http-server -g
```

2. serve the openapi spec v3.0 contents

```sh
cd examples/v3.0

# port: 4000, no cache
http-server . -p 4000 -g -c-1
```

3. enter examples/3.0-results

```sh
cd examples/3.0-results
```

## commands

1. api-with-examples.json

```sh
yo api-on-calling \
--lang=javascript \
--service=ApiWithExamplesService \
--schema-url=http://localhost:4000/api-with-examples.json \
--javascript-keyword-request="import { request } from '@request/api-with-examples.request'"
```

2. callback-example.json

```sh
yo api-on-calling \
--lang=javascript \
--service=CallbackExampleService \
--schema-url=http://localhost:4000/callback-example.json \
--javascript-keyword-request="import { request } from '@request/callback-example.request'"
```

3. link-example.json

```sh
yo api-on-calling \
--lang=javascript \
--service=LinkExampleService \
--schema-url=http://localhost:4000/link-example.json \
--javascript-keyword-request="import { request } from '@request/link-example.request'"
```

4. petstore-expanded.json

```sh
yo api-on-calling \
--lang=javascript \
--service=PetStoreExpandedService \
--schema-url=http://localhost:4000/petstore-expanded.json \
--javascript-keyword-request="import { request } from '@request/petstore-expanded.request'"
```

5. petstore.json

```sh
yo api-on-calling \
--lang=javascript \
--service=PetStoreService \
--schema-url=http://localhost:4000/petstore.json \
--javascript-keyword-request="import { request } from '@request/petstore.request'"
```

6. uspto.json

```sh
yo api-on-calling \
--lang=javascript \
--service=UsptoService \
--schema-url=http://localhost:4000/uspto.json \
--javascript-keyword-request="import { request } from '@request/uspto.request'"
```
