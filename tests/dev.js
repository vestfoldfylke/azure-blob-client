require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })    // Load different .env files based on NODE_ENV
const client = require('../')

(async () => {
  console.log('== Dev start ==');

  console.log('== Saves blobs ==')
  await client.save('test.txt', 'testdata');
  await client.save('test/test2.txt', 'data:plain/text;utf-8,test2');
  await client.save('test/folder1/test3.txt', 'data:plain/text;utf-8,test3');

  console.log('== List the blobs ==')
  let list = await client.list('test');
  console.log(list);

  console.log('== Get one directly ==');
  let blob1Solo = await client.get('test.txt');
  console.log(blob1Solo);

  console.log('== Get by common path ==');
  let blobs = await client.get('test/');
  console.log(blobs);

  console.log('== Delete single ==');
  let del1 = await client.remove('test.txt');
  console.log(del1);

  console.log('== Delete rest ==');
  let del2 = await client.remove('test');
  console.log(del2);
})();