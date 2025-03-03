import weaviate from 'weaviate-ts-client';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

//---------------read files & upload to db----------------------
const toBase64 = (file) => Buffer.from(file).toString('base64');

const imgFiles = readdirSync('./img');
const promises = imgFiles.map(async (imgFile) => {
    const b64 = toBase64(readFileSync(`./img/${imgFile}`));
    await client.data.creator()
        .withClassName('Meme')
        .withProperties({
            image: b64,
            text: imgFile.split('.')[0].split('_').join(' ')
        })
        .do();
});

// Wait for all promises to complete
await Promise.all(promises);

//---------------search for similar images as this----------------------
const test = Buffer.from(readFileSync('./test.png')).toString('base64');

const resImage = await client.graphql.get()
    .withClassName('Meme')
    .withFields(['image'])
    .withNearImage({ image: test })
    .withLimit(1)
    .do();

// Write result to filesystem
const result = resImage.data.Get.Meme[0].image;
writeFileSync('./result.jpg', result, 'base64');