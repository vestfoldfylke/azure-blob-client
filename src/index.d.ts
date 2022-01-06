export const unallowedPathCharacters: string[];
/**
 * Creates a blobservice client, useful for lower level API access
 * Not necessary to use for simple CRUD operations
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {BlobServiceClient} Azure blob service client
 */
export function createBlobServiceClient(options?: {
    connectionString: string | null;
    containerName: string | null;
}): BlobServiceClient;
/**
 * Creates a ContainerClient, useful for lower level API access
 * Not necessary to use for simple CRUD operations
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {ContainerClient} ContainerClient
 */
export function createContainerClient(options?: {
    connectionString: string | null;
    containerName: string | null;
}): ContainerClient;
/**
 * Lists all blobs for the provided path
 * @param {string?} path The path of the container
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 */
export function list(path: string | null, options?: {
    connectionString: string | null;
    containerName: string | null;
}): Promise<{
    name: string;
    path: string;
    blobType: import("@azure/storage-blob").BlobType;
    createdOn: Date;
    lastModified: Date;
    lastAccessedOn: Date;
}[]>;
/**
 * Gets a single file or all files under a folder
 * @param {String} path
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 */
export function get(path: string, options?: {
    connectionString: string | null;
    containerName: string | null;
}): Promise<{
    name: string;
    path: string;
} | {
    name: string;
    path: string;
}[]>;
/**
 * Saves a blob
 * @param {String} path
 * @param {String} content
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns {Promise<String>} Path of the created blob
 */
export function save(path: string, content: string, options?: {
    connectionString: string | null;
    containerName: string | null;
}): Promise<string>;
/**
 * Deletes any blobs at the given path
 * @param {String} path
 * @param {object} options
 * @param {string?} options.connectionString The Azure storage account connection string
 * @param {string?} options.containerName The name of the Azure storage account container name
 * @returns { Promise<String> | Promise<[String]>} The deleted paths
 */
export function remove(path: string, options?: {
    connectionString: string | null;
    containerName: string | null;
}): Promise<string> | Promise<[string]>;
import { BlobServiceClient } from "@azure/storage-blob";
import { ContainerClient } from "@azure/storage-blob";
