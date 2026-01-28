import { BlobStorageClient } from "../src/index.js";

import type { BlobStorageItem } from "../src/types/BlobStorageClient.type";

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

  let saveTestJson: string = await client.save("test.json", { hei: "ja", active: true });
  console.log("Saved test.json:", saveTestJson);

  console.log("\n== List the blobs (should be an array with 4 blobs) ==");
  const list: BlobStorageItem[] = await client.list("test");
  console.log(list);

  console.log("\n== Get a specific blob (should be an array with 1 blob) ==");
  const blob1Solo: BlobStorageItem[] = await client.get("test.txt");
  console.log(blob1Solo);

  console.log("\n== Get a specific JSON blob (should be an array with 1 blob) ==");
  const blobJSON: BlobStorageItem[] = await client.get("test.json");
  console.log(blobJSON);
  console.log(blobJSON[0]?.data);

  console.log("\n== Get blobs by common path (test/) ==");
  const blobs: BlobStorageItem[] = await client.get("test/");
  console.log(blobs);

  console.log("\n== Delete a single blob ==");
  const del1: string[] = await client.remove("test.txt");
  console.log(del1);

  console.log("\n== Delete rest of the blobs (test) ==");
  const del2: string[] = await client.remove("test");
  console.log(del2);

  console.log("\n== List all blobs (should be an empty array) ==");
  const listEmpty: BlobStorageItem[] = await client.list("*");
  console.log(listEmpty);

  console.log("\n== Save blobs for move ==");
  saveTestJson = await client.save("test.json", { hei: "ja", active: true });
  console.log("Saved test.json:", saveTestJson);

  console.log("\n== Move a blob (test.json -> test/test20.json) ==");
  const movedPath: string = await client.move("test.json", "test/test20.json");
  console.log("Moved blob to:", movedPath);
  const moveTest: BlobStorageItem[] = await client.get("test.json");
  console.log("Get old path (test.json) (should be empty array):", moveTest);
  const moveTestNew: BlobStorageItem[] = await client.get("test/test20.json");
  console.log("Get new path (test/test20.json) (should have a single blob):", moveTestNew);

  console.log("\n== Delete rest of the blobs (test) ==");
  const delMove: string[] = await client.remove("test");
  console.log(delMove);

  console.log("\n== List all blobs (*) (should be an empty array) ==");
  const listMoveEmpty: BlobStorageItem[] = await client.list("*");
  console.log(listMoveEmpty);
})();
