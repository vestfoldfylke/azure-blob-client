# azure-blob-client
A convenient library for working with Azure storage blobs

## Get started
1. Install
    ``` bash
    npm i @vestfoldfylke/azure-blob-client
    ```
2. Setup environment variables **(Not required)**

| Name                         | Example                                                                                                            |
|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| AZURE_BLOB_CONNECTION_STRING | DefaultEndpointsProtocol=https;AccountName=\[AccountName];AccountKey=\[AccountKey];EndpointSuffix=core.windows.net |
| AZURE_BLOB_CONTAINER_NAME    | Blobs                                                                                                              |

## Usage
``` TypeScript
import { BlobStorageClient } from "@vestfoldfylke/azure-blob-client";

// Create a new BlobStorageClient instance where connection string and container name are provided via environment variables explicitly
const blobStorageClient = new BlobStorageClient({
  connectionString: "<your-connection-string>",
  containerName: "<your-container-name>"
});

// Create a new BlobStorageClient instance where connection string and container name are provided via environment variables implicitly
// NOTE: Make sure the AZURE_BLOB_CONNECTION_STRING and AZURE_BLOB_CONTAINER_NAME environment variables are set
const blobStorageClient = new BlobStorageClient();
```

## Functions & examples
### Save
Saves content to a given path
``` TypeScript
// Create a blob with path test.txt
await blobClient.save('test.txt', 'testdata');
await blobClient.save('test/test2.txt', 'data:plain/text;utf-8,test2');
await blobClient.save('test/folder1/test3.txt', 'data:plain/text;utf-8,test3');
```
We recommend using the dataUrl-format for storing data as it makes it easier to work with after it is retrieved.
Example: img-tags in HTML can display them as pictures and browsers can easily handle and download them.

If stored in dataUrl format the MIME type and encoding will be parsed when retrieving the data.

### List
List one or more blobs matching the provided path. The parameter path works as startsWith, so if you e.g. want to list
blobs inside a folder add a `/` at the end of the path

```TypeScript
await blobClient.list(`${directoryName}/`)
```

``` TypeScript
// Gets all blobs that has a path that starts with test
await blobClient.list('test');

// Gets all blobs in container
await blobClient.list('*');

// Yields
[
  {
    name: 'test.txt',
    path: 'test.txt',
    blobType: 'BlockBlob',
    createdOn: 2021-12-17T13:42:43.000Z,
    lastModified: 2021-12-17T13:46:18.000Z,
    lastAccessedOn: undefined
  },
  {
    name: 'test2.txt',
    path: 'test/test2.txt',
    blobType: 'BlockBlob',
    createdOn: 2021-12-17T13:42:43.000Z,
    lastModified: 2021-12-17T13:46:18.000Z,
    lastAccessedOn: undefined
  },
  {
    name: 'test3.txt',,
    path: 'test/folder1/test3.txt',
    blobType: 'BlockBlob',
    createdOn: 2021-12-17T13:42:43.000Z,
    lastModified: 2021-12-17T13:46:18.000Z,
    lastAccessedOn: undefined
  }
]
```

### Get
Get one or more blobs with its data
``` TypeScript
// Gets a blob with name/path test.txt
await blobClient.get('test.txt')

// Yields
{
  name: 'test.txt',
  path: 'test.txt',
  extension: 'txt',
  data: 'testdata'
}

```
``` TypeScript
// Gets a blob with name/path test.txt
await blobClient.get('test/')

// Yields
[
  {
    name: 'test2.txt',
    path: 'test/test2.txt',
    extension: 'txt',
    type: 'plain/test',
    encoding: 'utf-8',
    data: 'data:plain/text;utf-8,test2'
  },
  {
    name: 'test3.txt',
    path: 'test/folder1/test3.txt',
    extension: 'txt',
    type: 'plain/test',
    encoding: 'utf-8',
    data: 'data:plain/text;utf-8,test3'
  }
]
```

#### Specify encoding of return value
If you for example need `get` to return base64 instead of a buffer string, you can specify encoding.

See valid encodings in [NodeJs official documentation](https://nodejs.org/api/buffer.html#buffers-and-character-encodings) 
```TypeScript
// Gets a blob with name/path test.pdf and returns the content as a base64 string
await blobClient.get('test.pdf', 'base64')

// Yields
const result = {
  name: 'test.pdf',
  path: 'test.pdf',
  extension: 'pdf',
  data: 'JVBERi0xLjQNCiX5+pr==....'
}

```

### Remove
Removes one or more blobs matching the provided path
``` TypeScript
// Removes the blob with path test.txt
await blobClient.remove('test.txt');

// Yields
[ 'test.txt' ]

// Removes all blobs starting with test
await blobClient.remove('test');

// Yields
[ 'test/test2.txt', 'test/folder1/test3.txt' ]

// Removes all blobs starting with test except test3.txt
await blobClient.remove('test', ['test3.txt']);

// Yields
[ 'test/test2.txt' ]
```

### BlobServiceClient
If you need to work with lower-level API's you can create a BlobServiceClient and/or ContainerClient yourself.
``` TypeScript
// Create the BlobServiceClient
const blobServiceClient: BlobServiceClient = new BlobServiceClient(...);

// Create the ContainerClient
const containerClient: ContainerClient = new ContainerClient(...);
```
