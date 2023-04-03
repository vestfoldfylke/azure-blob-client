# azure-blob-client
An convenient library for working with Azure storage blobs

## Get started
1. Install
``` javascript
npm i @vtfk/azure-blob-client
```
2. Setup environment variables **(Not required)**


| Name | Example |
|---|---|
|AZURE_BLOB_CONNECTIONSTRING| DefaultEndpointsProtocol=https;AccountName=\[AccountName];AccountKey=\[AccountKey];EndpointSuffix=core.windows.net
| AZURE_BLOB_CONTAINERNAME | Blobs |

## Import the package
``` javascript
const blobClient = require('@vtfk/azure-blob-client');
// OR just require the functions you need with destructoring
const { list, get, create, remove } = require('@vtfk/azure-blob-client'); 
```

## Functions & examples
### Save
Saves content to a given path
``` javascript
// Create a blob with path test.txt
await blobClient.save('test.txt', 'testdata');
await blobClient.save('test/test2.txt', 'data:plain/text;utf-8,test2');
await blobClient.save('test/folder1/test3.txt', 'data:plain/text;utf-8,test3');
```
We recommend using the dataUrl-format for storing data as it makes it easier to work with after it is retreived.
Example: img-tags in HTML can display them as pictures and browsers can easily handle and download them.

If stored in dataUrl format the MIME type and encoding will be parsed when retreiving the data.

### List
List one or more blobs matching the provided path
``` javascript
// Gets all blobs that has a path that starts with test
await blobClient.list('test');

// Yelds
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
``` javascript
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
``` javascript
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
If you for example need `get` to return base64 instead of a bufferstring, you can specify encoding in the options-parameter.

See valid encodings in [NodeJs official documentation](https://nodejs.org/api/buffer.html#buffers-and-character-encodings) 
```js
// Gets a blob with name/path test.pdf and returns the content as a base64 string
await blobClient.get('test.pdf', { encoding: 'base64' })

// Yields
{
  name: 'test.pdf',
  path: 'test.pdf',
  extension: 'pdf',
  data: 'JVBERi0xLjQNCiX5+pr==....'
}

```

### Remove
Removes one or more blobs patching the provided path
``` javascript
// Removes the blob with path test.txt
await blobClient.remove('test.txt');

// Yields
[ 'test.txt' ]
```
``` javascript
// Removes all blobs starting with test
await blobClient.remove('test');

// Yields
[ 'test/test2.txt', 'test/folder1/test3.txt' ]
```

### createBlobServiceClient
Creates and returns a BlobServiceClient for working with lower-level API
``` javascript
// Create the client
const client = await blobClient.createBlobServiceClient();
```

### createContainerClient
Creates and returns a ContainerClient for working with lower-level API
``` javascript
// Create the client
const client = await blobClient.createContainerClient();
```

### Other
All functions takes in an optional options object
``` javascript
// Create the options object
const options = {
  connectionString: 'Azure storage account connection string',
  containerName: 'Azure storage account container name '
}
// Get blobs with provided options
await blobClient.get('test.txt', options);
```
