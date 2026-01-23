import { BlobStorageClient } from "../index.js";

import type { BlobStorageItem } from "../types/BlobStorageClient.type";

(async () => {
  console.log("== Dev start ==");

  const client: BlobStorageClient = new BlobStorageClient();

  console.log("\n== Save blobs ==");
  const saveTest: string = await client.save("test.txt", "testdata");
  console.log("Saved test.txt:", saveTest);

  const saveTest2: string = await client.save("test/test2.txt", "data:plain/text;utf-8,test2");
  console.log("Saved test2.txt:", saveTest2);

  const saveTest3: string = await client.save("test/folder1/test3.txt", "data:plain/text;utf-8,test3");
  console.log("Saved test3.txt:", saveTest3);

  const saveTestJson: string = await client.save("test.json", { hei: "ja", active: true });
  console.log("Saved test.json:", saveTestJson);

  console.log("\n== List the blobs ==");
  const list: BlobStorageItem[] = await client.list("test");
  console.log(list);

  console.log("\n== Get a specific blob (should be an array with 1 blob) ==");
  const blob1Solo: BlobStorageItem[] = await client.get("test.txt");
  console.log(blob1Solo);

  console.log("\n== Get a specific JSON blob (should be an array with 1 blob) ==");
  const blobJSON: BlobStorageItem[] = await client.get("test.json");
  console.log(blobJSON);
  console.log(blobJSON[0]?.data);

  console.log("\n== Get blobs by common path ==");
  const blobs: BlobStorageItem[] = await client.get("test/");
  console.log(blobs);

  console.log("\n== Delete a single blob ==");
  const del1: string[] = await client.remove("test.txt");
  console.log(del1);

  console.log("\n== Delete rest of the blobs ==");
  const del2: string[] = await client.remove("test");
  console.log(del2);

  console.log("\n== List all blobs (should be an empty array) ==");
  const listEmpty: BlobStorageItem[] = await client.list("*");
  console.log(listEmpty);
})();
