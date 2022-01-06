/*
  Import dependencies
*/
const { BlobServiceClient, ContainerClient } = require('@azure/storage-blob');

/*
  Declarations
*/
const AzureBlobConnectionString = process.env.AZURE_BLOB_CONNECTIONSTRING;
const AzureBlobContainerName = process.env.AZURE_BLOB_CONTAINERNAME;
const unallowedPathCharacters = ['\\', ':', '*', '?', '"', '<', '>', '|'];
module.exports.unallowedPathCharacters = unallowedPathCharacters

/*
  Private functions
*/
function getConnectionString (options = {}) {
  const value = options.connectionString || AzureBlobConnectionString
  if (!value) throw new Error('No connectionString was provided');
  return value;
}

function getContainerName (options = {}) {
  const value = options.containerName || AzureBlobContainerName
  if (!value) throw new Error('No connectionString was provided');
  return value;
}

/**
 * Reads a stream and outputs a buffer
 * @param {ReadableStream} readableStream
 * @returns {Promise<Buffer>}
 */
async function streamToBuffer (readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => chunks.push(data instanceof Buffer ? data : Buffer.from(data)));
    readableStream.on('end', () => resolve(Buffer.concat(chunks)));
    readableStream.on('error', reject);
  })
}

/**
 *
 * @param {String} dataUrl
 */
function parseDataUrl (text) {
  if (!text) return;

  const dataUrl = {};

  // If the content is formated as dataUrl, attempt to get mimeType and Encoding
  if (text.startsWith('data:')) {
    const split = text.substring(5).split(',');
    if (split.length === 2) {
      const parts = split[0].split(';');
      if (parts.length === 2) {
        dataUrl.type = parts[0];
        dataUrl.encoding = parts[1];
      }
      dataUrl.data = split[1];
    }
  }

  // Return dataUrl if parsing was successful, if not just return undefined
  if (dataUrl.type && dataUrl.encoding && dataUrl.data) return dataUrl;
}

/*
  Exported functions
*/

/**
 * Creates a blobservice client, useful for lower level API access
 * Not necessary to use for simple CRUD operations
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {BlobServiceClient} Azure blob service client
 */
function createBlobServiceClient (options = {}) {
  // Get connection string
  const connectionString = getConnectionString(options);

  // Create and return a BlobServiceClient
  return BlobServiceClient.fromConnectionString(connectionString)
}
module.exports.createBlobServiceClient = createBlobServiceClient;

/**
 * Creates a ContainerClient, useful for lower level API access
 * Not necessary to use for simple CRUD operations
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {ContainerClient} ContainerClient
 */
function createContainerClient (options = {}) {
  // Get connection string
  const connectionString = getConnectionString(options);

  // Get Azure storage container name
  const containerName = getContainerName(options);

  // Create and return the container client
  return new ContainerClient(connectionString, containerName);
}
module.exports.createContainerClient = createContainerClient;

/**
 * Lists all blobs for the provided path
 * @param {string?} path The path of the container
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 */
async function list (path, options = {}) {
  // Input validation
  if (!path) throw new Error('Path cannot be empty');

  // Set the path as the prefix
  options.prefix = path;

  // Create the ContainerClient
  const client = createContainerClient(options);

  // Get all blobs
  const blobs = [];
  for await (const blob of client.listBlobsFlat(options)) {
    const name = blob.name.includes('/') ? blob.name.substring(blob.name.lastIndexOf('/') + 1) : blob.name;
    const b = { name: name, path: blob.name, blobType: blob.properties.blobType, createdOn: blob.properties.createdOn, lastModified: blob.properties.lastModified, lastAccessedOn: blob.properties.lastAccessedOn }
    blobs.push(b);
  }

  // List and return the blobs
  return blobs;
}
module.exports.list = list;

/**
 * Gets a single file or all files under a folder
 * @param {String} path
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 */
async function get (path, options = {}) {
  // Input validation
  if (!path) throw new Error('Path cannot be empty');

  // Create the ContainerClient
  const client = createContainerClient(options);

  // Check if it exist as a blob, if not attempt to find folder
  const blobPaths = [];
  const blobClient = client.getBlobClient(path);
  if (await blobClient.exists()) {
    blobPaths.push(path);
  } else {
    const blobs = await list(path);
    if (blobs && Array.isArray(blobs) && blobs.length > 0) blobs.forEach((p) => blobPaths.push(p.path));
    else throw new Error(`The path ${path} does not exist as a folder or blob`);
  }

  // Download the blobs
  const blobs = [];
  for (const blobPath of blobPaths) {
    // Create a blobclient for the path
    const blobClient = client.getBlobClient(blobPath);
    // Download the blob
    const downloadResponse = await blobClient.download();
    // Read the content stream
    const data = (await streamToBuffer(downloadResponse.readableStreamBody)).toString();

    // Create the blob
    const blob = {
      name: blobPath.split('/').pop(),
      path: blobPath
    };

    // Get the extension if applicable
    if (blob.name.includes('.')) blob.extension = blob.name.substring(blob.name.lastIndexOf('.') + 1);

    // If the content is formated as dataUrl, attempt to get mimeType and Encoding
    const dataUrl = parseDataUrl(data);
    if (dataUrl) {
      if (dataUrl.type) blob.type = dataUrl.type;
      if (dataUrl.encoding) blob.encoding = dataUrl.encoding;
    }

    // Add the content
    blob.data = data;

    // Add the blob to the array
    blobs.push(blob);
  }

  // If no blobs was found
  if (blobs.length <= 0) throw new Error('Could not retreive any blobs');

  // Return the blob or blobs
  if (blobs.length === 1) return blobs[0];
  return blobs;
}
module.exports.get = get;

/**
 * Saves a blob
 * @param {String} path
 * @param {String} content
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {Promise<String>} Path of the created blob
 */
async function save (path, content, options = {}) {
  // Input validation
  if (!path) throw new Error('Path must be specified');
  if (!content) throw new Error('Content must be specified');

  // Check that the path don't contain illegal characters
  unallowedPathCharacters.forEach((char) => {
    if (path.includes(char)) throw new Error(`Path ${path} cannot contain character '${char}'`)
  })

  // Check if the content is dataurl
  const dataUrl = parseDataUrl(content);
  if (dataUrl) {
    options.metadata = {
      type: dataUrl.type,
      encoding: dataUrl.encoding
    }
  }

  // Create the necessary clients
  const client = createContainerClient(options);
  const blockBlobClient = client.getBlockBlobClient(path);

  // Upload the blob
  await blockBlobClient.upload(content, Buffer.byteLength(content), options);

  // Return the path of the created blob
  return path;
}
module.exports.save = save;

/**
 * Deletes any blobs at the given path
 * @param {String} path
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns { Promise<String> | Promise<[String]>} The deleted paths
 */
async function remove (path, options = {}) {
  // Input validation
  if (!path) throw new Error('Path cannot be empty');

  // Get the list of all blobs on the given path
  const blobs = await list(path, options);
  if (!blobs || !Array.isArray(blobs) || blobs.length <= 0) return;

  // Create the client
  const containerClient = createContainerClient(options);

  // Delete each blob
  const paths = [];
  for await (const blob of blobs) {
    if (!blob.path) continue;
    paths.push(blob.path);
    await containerClient.getBlockBlobClient(blob.path).deleteIfExists(options);
  }

  return paths;
}
module.exports.remove = remove;
