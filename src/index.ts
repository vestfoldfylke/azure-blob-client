import { basename, extname } from "node:path";
import {
  type BlobClient,
  type BlobDeleteIfExistsResponse,
  type BlobDeleteOptions,
  type BlobDownloadResponseParsed,
  type BlockBlobClient,
  ContainerClient,
  type ContainerListBlobsOptions
} from "@azure/storage-blob";
import type { BlockBlobUploadOptionalParams } from "@azure/storage-blob/dist/browser/generated/src";

import type { BlobStorageClientOptions, BlobStorageDataUrl, BlobStorageItem, IBlobStorageClient } from "./types/BlobStorageClient.type";

/**
 * Convenient storage client for interacting with Azure Blob Storage
 */
export class BlobStorageClient implements IBlobStorageClient {
  private readonly _containerClient: ContainerClient;

  public readonly UNALLOWED_PATH_CHARACTERS: string[] = ["\\", ":", "*", "?", '"', "<", ">", "|"];

  constructor(options?: BlobStorageClientOptions) {
    const connectionString: string | undefined = options?.connectionString || process.env["AZURE_BLOB_CONNECTION_STRING"];
    if (!connectionString) {
      throw new Error("Connection string for Azure Blob Storage is not provided");
    }

    const containerName: string | undefined = options?.containerName || process.env["AZURE_BLOB_CONTAINER_NAME"];
    if (!containerName) {
      throw new Error("Container name for Azure Blob Storage is not provided");
    }

    this._containerClient = new ContainerClient(connectionString, containerName, options?.storagePipelineOptions);
  }

  public async get(path: string, encoding: BufferEncoding = "utf8"): Promise<BlobStorageItem[]> {
    if (!path) {
      throw new Error("Path is required to get blobs");
    }

    const blobClient: BlobClient = this._containerClient.getBlobClient(path);

    const blobPaths: string[] = (await blobClient.exists()) ? [path] : (await this.list(path)).map((blob: BlobStorageItem) => blob.path);

    const blobs: BlobStorageItem[] = [];

    for (const blobPath of blobPaths) {
      const currentBlobClient: BlobClient = this._containerClient.getBlobClient(blobPath);

      const downloadResponse: BlobDownloadResponseParsed = await currentBlobClient.download();
      if (!downloadResponse.readableStreamBody) {
        console.error("Blob download response has no readable stream body:", downloadResponse.errorCode);
        continue;
      }

      const blobData: string = (await this.streamToBuffer(downloadResponse.readableStreamBody)).toString(encoding);

      const blobStorageItem: BlobStorageItem = {
        name: basename(blobPath),
        path: blobPath,
        data: blobData
      };

      if (blobStorageItem.name.includes(".")) {
        blobStorageItem.extension = extname(blobStorageItem.name).replace(".", "");
      }

      const blobStorageDataUrl: BlobStorageDataUrl | undefined = this.parseDataUrl(blobData);
      if (blobStorageDataUrl) {
        blobStorageItem.type = blobStorageDataUrl.type;
        blobStorageItem.encoding = blobStorageDataUrl.encoding;

        blobStorageItem.data = blobStorageDataUrl.type === "application/json" ? JSON.parse(blobStorageDataUrl.data) : blobStorageDataUrl.data;
      }

      blobs.push(blobStorageItem);
    }

    return blobs;
  }

  public async list(path: string, options?: ContainerListBlobsOptions): Promise<BlobStorageItem[]> {
    if (!path) {
      throw new Error("Path is required to list blobs");
    }

    if (!options) {
      options = {};
    }

    if (path === "*") {
      path = "";
    }

    options.prefix = path;

    const blobs: BlobStorageItem[] = [];

    for await (const blob of this._containerClient.listBlobsFlat(options)) {
      const name: string = basename(blob.name);

      blobs.push({
        ...blob,
        name,
        path: blob.name
      });
    }

    return blobs;
  }

  public async remove(path: string, excludeBlobNames: string[] = [], options?: BlobDeleteOptions): Promise<string[]> {
    if (!path) {
      throw new Error("Path is required to remove blobs");
    }

    const blobStorageItems: BlobStorageItem[] = await this.list(path);
    if (blobStorageItems.length === 0) {
      return [];
    }

    const deletedBlobPaths: string[] = [];

    for (const blobStorageItem of blobStorageItems) {
      if (excludeBlobNames.includes(blobStorageItem.name)) {
        continue;
      }

      const deleted: BlobDeleteIfExistsResponse = await this._containerClient.getBlockBlobClient(blobStorageItem.path).deleteIfExists(options);
      if (!deleted.succeeded) {
        console.error("Failed to delete blob at path:", blobStorageItem.path, ":: ErrorCode:", deleted.errorCode);
        continue;
      }

      deletedBlobPaths.push(blobStorageItem.path);
    }

    return deletedBlobPaths;
  }

  public async save(path: string, content: string | object | null, options?: BlockBlobUploadOptionalParams): Promise<string> {
    if (!path) {
      throw new Error("Path is required to save blob");
    }

    if (!content) {
      throw new Error("Content is required to save blob");
    }

    if (this.UNALLOWED_PATH_CHARACTERS.some((char: string) => path.includes(char))) {
      throw new Error(`Path contains unallowed characters: ${this.UNALLOWED_PATH_CHARACTERS.join(" ")}`);
    }

    const blobStorageDataUrl: BlobStorageDataUrl | undefined = typeof content === "string" ? this.parseDataUrl(content) : undefined;
    if (blobStorageDataUrl) {
      options ??= {};
      options.metadata ??= {
        encoding: blobStorageDataUrl.encoding,
        type: blobStorageDataUrl.type
      };
    }

    const blockBlobClient: BlockBlobClient = this._containerClient.getBlockBlobClient(path);
    console.log("ContentType:", typeof content, "-- Content:", content);
    const savableContent: string = typeof content === "object" ? `data:application/json;utf-8,${JSON.stringify(content)}` : content.toString();
    console.log("SavableContentType:", typeof savableContent, "-- SavableContent:", savableContent);

    await blockBlobClient.upload(savableContent, Buffer.byteLength(savableContent), options);

    return path;
  }

  private parseDataUrl(text: string): BlobStorageDataUrl | undefined {
    if (!text || !text.startsWith("data:") || !text.includes(",")) {
      return undefined;
    }

    const typeAndEncodingParts = text.substring(5, text.indexOf(",")).split(";");
    if (typeAndEncodingParts.length < 2) {
      throw new Error("Data URL is malformed.");
    }

    return {
      data: text.substring(text.indexOf(",") + 1),
      encoding: typeAndEncodingParts[1] as string,
      type: typeAndEncodingParts[0] as string
    };
  }

  private streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      readableStream.on("data", (data) => chunks.push(data instanceof Buffer ? data : Buffer.from(data)));
      readableStream.on("end", () => resolve(Buffer.concat(chunks)));
      readableStream.on("error", reject);
    });
  }
}
