import type { BlobItem, StoragePipelineOptions } from "@azure/storage-blob";
import type { BlockBlobUploadOptionalParams } from "@azure/storage-blob/dist/browser/generated/src";
import type { ContainerListBlobsOptions } from "@azure/storage-blob/dist/esm";

export type BlobStorageClientOptions = {
  connectionString: string;
  containerName: string;
  storagePipelineOptions?: StoragePipelineOptions;
};

export type BlobStorageItem = Omit<BlobItem, "name" | "deleted" | "properties" | "snapshot"> & {
  /** Blob name (without path) */
  name: string;
  /** Full path to blob */
  path: string;
  /** The decoded blob<br/><br />
   * <b>NOTE: Present only when returned from <i>get</i></b> */
  data?: string;
  /** The encoding used for the blob<br/><br />
   * <b>NOTE: Present only when returned from <i>get</i></b> */
  encoding?: string;
  /** The extension of the file in the blob<br/><br />
   * <b>NOTE: Present only when returned from <i>get</i></b> */
  extension?: string;
  /** The MIME type of the data in the blob<br/><br />
   * <b>NOTE: Present only when returned from <i>get</i></b> */
  type?: string;
};

export interface IBlobStorageClient {
  readonly UNALLOWED_PATH_CHARACTERS: string[];
  /** Get files with content from the provided path */
  get: (path: string, encoding?: BufferEncoding) => Promise<BlobStorageItem[]>;
  /**
   * List all blobs (without content) for the provided path
   * @param path - The path to a container, blob or virtual folder
   * @param [options] - Options for listing blobs
   */
  list: (path: string, options?: ContainerListBlobsOptions) => Promise<BlobStorageItem[]>;
  /**
   * Remove any blobs at the given path
   * @param path
   * @param excludeBlobNames - List of blob names to exclude from deletion. Default: []
   */
  remove: (path: string, excludeBlobNames: string[]) => Promise<string[]>;
  /** Save a blob */
  save: (path: string, content: string | object | null, options?: BlockBlobUploadOptionalParams) => Promise<string>;
}

export type BlobStorageDataUrl = {
  data: string;
  encoding: string;
  type: string;
};
