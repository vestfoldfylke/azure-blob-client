import type { BlobDeleteOptions, BlobItem, ContainerListBlobsOptions, StoragePipelineOptions } from "@azure/storage-blob";
import type { BlockBlobUploadOptionalParams } from "@azure/storage-blob/dist/browser/generated/src";

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

  get: (path: string, encoding?: BufferEncoding) => Promise<BlobStorageItem[]>;

  list: (path: string, options?: ContainerListBlobsOptions) => Promise<BlobStorageItem[]>;

  move: (
    sourcePath: string,
    destinationPath: string,
    saveOptions?: BlockBlobUploadOptionalParams,
    removeOptions?: BlobDeleteOptions
  ) => Promise<string>;

  remove: (path: string, excludeBlobNames: string[]) => Promise<string[]>;

  save: (path: string, content: string | object | null, options?: BlockBlobUploadOptionalParams) => Promise<string>;
}

export type BlobStorageDataUrl = {
  data: string;
  encoding: string;
  type: string;
};
