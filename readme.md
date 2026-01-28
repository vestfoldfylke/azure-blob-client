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
await blobStorageClient.save('test.txt', 'testdata');
await blobStorageClient.save('test/test2.txt', 'data:plain/text;utf-8,test2');
await blobStorageClient.save('test/folder1/test3.txt', 'data:plain/text;utf-8,test3');
```

We recommend using the dataUrl-format for storing data as it makes it easier to work with after it is retrieved.
Example: img-tags in HTML can display them as pictures and browsers can easily handle and download them.

If stored in dataUrl format the MIME type and encoding will be parsed when retrieving the data.

### List

List one or more blobs matching the provided path. The parameter path works as startsWith, so if you e.g. want to list
blobs inside a folder add a `/` at the end of the path

```TypeScript
await blobStorageClient.list(`${directoryName}/`)

// Gets all blobs that has a path that starts with test
await blobStorageClient.list('test');

// Gets all blobs in container
await blobStorageClient.list('*');

// Yields
[
   {
      "name": "test.txt",
      "deleted": undefined,
      "snapshot": undefined,
      "versionId": undefined,
      "isCurrentVersion": undefined,
      "properties": {
         "createdOn": "2026-01-27T17:30:22.000Z",
         "lastModified": "2026-01-27T17:30:22.000Z",
         "etag": "0x1B91582CD8B72C0",
         "contentLength": 54,
         "contentType": "application/octet-stream",
         "contentEncoding": undefined,
         "contentLanguage": undefined,
         "contentMD5": "<Buffer 3b 43 94 49 9c 1c 6a c5 2d 27 da 62 da 11 03 0d>",
         "contentDisposition": undefined,
         "cacheControl": undefined,
         "blobSequenceNumber": undefined,
         "blobType": "BlockBlob",
         "leaseStatus": "unlocked",
         "leaseState": "available",
         "leaseDuration": undefined,
         "copyId": undefined,
         "copyStatus": undefined,
         "copySource": undefined,
         "copyProgress": undefined,
         "copyCompletedOn": undefined,
         "copyStatusDescription": undefined,
         "serverEncrypted": true,
         "incrementalCopy": undefined,
         "destinationSnapshot": undefined,
         "deletedOn": undefined,
         "remainingRetentionDays": undefined,
         "accessTier": "Hot",
         "accessTierInferred": true,
         "archiveStatus": undefined,
         "customerProvidedKeySha256": undefined,
         "encryptionScope": undefined,
         "accessTierChangedOn": "2026-01-27T17:30:22.000Z",
         "tagCount": undefined,
         "expiresOn": undefined,
         "isSealed": undefined,
         "rehydratePriority": undefined,
         "lastAccessedOn": undefined,
         "immutabilityPolicyExpiresOn": undefined,
         "immutabilityPolicyMode": undefined,
         "legalHold": undefined
      },
      "metadata": undefined,
      "blobTags": undefined,
      "objectReplicationMetadata": undefined,
      "hasVersionsOnly": undefined,
      "tags": undefined,
      "objectReplicationSourceProperties": undefined,
      "path": "test.txt"
   },
   {
      "name": "test2.txt",
      "deleted": undefined,
      "snapshot": undefined,
      "versionId": undefined,
      "isCurrentVersion": undefined,
      "properties": {
         "createdOn": "2026-01-27T17:30:22.000Z",
         "lastModified": "2026-01-27T17:30:22.000Z",
         "etag": "0x22AF2A6A236E8C0",
         "contentLength": 8,
         "contentType": "application/octet-stream",
         "contentEncoding": undefined,
         "contentLanguage": undefined,
         "contentMD5": "<Buffer ef 65 4c 40 ab 4f 17 47 fc 69 99 15 d4 f7 09 02>",
         "contentDisposition": undefined,
         "cacheControl": undefined,
         "blobSequenceNumber": undefined,
         "blobType": "BlockBlob",
         "leaseStatus": "unlocked",
         "leaseState": "available",
         "leaseDuration": undefined,
         "copyId": undefined,
         "copyStatus": undefined,
         "copySource": undefined,
         "copyProgress": undefined,
         "copyCompletedOn": undefined,
         "copyStatusDescription": undefined,
         "serverEncrypted": true,
         "incrementalCopy": undefined,
         "destinationSnapshot": undefined,
         "deletedOn": undefined,
         "remainingRetentionDays": undefined,
         "accessTier": "Hot",
         "accessTierInferred": true,
         "archiveStatus": undefined,
         "customerProvidedKeySha256": undefined,
         "encryptionScope": undefined,
         "accessTierChangedOn": "2026-01-27T17:30:22.000Z",
         "tagCount": undefined,
         "expiresOn": undefined,
         "isSealed": undefined,
         "rehydratePriority": undefined,
         "lastAccessedOn": undefined,
         "immutabilityPolicyExpiresOn": undefined,
         "immutabilityPolicyMode": undefined,
         "legalHold": undefined
      },
      "metadata": undefined,
      "blobTags": undefined,
      "objectReplicationMetadata": undefined,
      "hasVersionsOnly": undefined,
      "tags": undefined,
      "objectReplicationSourceProperties": undefined,
      "path": "test/test2.txt"
   },
   {
      "name": "test3.txt",
      "deleted": undefined,
      "snapshot": undefined,
      "versionId": undefined,
      "isCurrentVersion": undefined,
      "properties": {
         "createdOn": "2026-01-27T17:30:22.000Z",
         "lastModified": "2026-01-27T17:30:22.000Z",
         "etag": "0x1D4075348288960",
         "contentLength": 27,
         "contentType": "application/octet-stream",
         "contentEncoding": undefined,
         "contentLanguage": undefined,
         "contentMD5": "<Buffer 3e ce 5d f1 05 b7 e4 0d c2 57 72 4e 80 d1 25 bb>",
         "contentDisposition": undefined,
         "cacheControl": undefined,
         "blobSequenceNumber": undefined,
         "blobType": "BlockBlob",
         "leaseStatus": "unlocked",
         "leaseState": "available",
         "leaseDuration": undefined,
         "copyId": undefined,
         "copyStatus": undefined,
         "copySource": undefined,
         "copyProgress": undefined,
         "copyCompletedOn": undefined,
         "copyStatusDescription": undefined,
         "serverEncrypted": true,
         "incrementalCopy": undefined,
         "destinationSnapshot": undefined,
         "deletedOn": undefined,
         "remainingRetentionDays": undefined,
         "accessTier": "Hot",
         "accessTierInferred": true,
         "archiveStatus": undefined,
         "customerProvidedKeySha256": undefined,
         "encryptionScope": undefined,
         "accessTierChangedOn": "2026-01-27T17:30:22.000Z",
         "tagCount": undefined,
         "expiresOn": undefined,
         "isSealed": undefined,
         "rehydratePriority": undefined,
         "lastAccessedOn": undefined,
         "immutabilityPolicyExpiresOn": undefined,
         "immutabilityPolicyMode": undefined,
         "legalHold": undefined
      },
      "metadata": undefined,
      "blobTags": undefined,
      "objectReplicationMetadata": undefined,
      "hasVersionsOnly": undefined,
      "tags": undefined,
      "objectReplicationSourceProperties": undefined,
      "path": "test/folder1/test3.txt"
   }
]
```

### Get

Get one or more blobs with its data

``` TypeScript
// Gets a blob with name/path test.txt
await blobStorageClient.get('test.txt')

// Yields
{
  name: 'test.txt',
  path: 'test.txt',
  extension: 'txt',
  data: 'testdata'
}

// Gets a blob with name/path test.txt
await blobStorageClient.get('test/')

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
await blobStorageClient.get('test.pdf', 'base64')

// Yields
const result = {
  name: 'test.pdf',
  path: 'test.pdf',
  extension: 'pdf',
  data: 'JVBERi0xLjQNCiX5+pr==....'
}

```

### Move

Moves one blob from sourcePath to destinationPath

``` TypeScript
// Moves the blob from test.txt to moved/test.txt
await blobStorageClient.move('test.txt', 'moved/test.txt');

// Yields
'moved/test.txt'
```

### Remove

Removes one or more blobs matching the provided path

``` TypeScript
// Removes the blob with path test.txt
await blobStorageClient.remove('test.txt');

// Yields
[ 'test.txt' ]

// Removes all blobs starting with test
await blobStorageClient.remove('test');

// Yields
[ 'test/test2.txt', 'test/folder1/test3.txt' ]

// Removes all blobs starting with test except test3.txt
await blobStorageClient.remove('test', ['test3.txt']);

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
