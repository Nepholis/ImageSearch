import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

//-------------------create schema--------------------
const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}
await client.schema
    .classCreator()
    .withClass(schemaConfig)
    .do();


const schemaRes = await client.schema.getter().do();
console.log(schemaRes)