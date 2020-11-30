const { env, esConfig } = require('../src/config/vars');
const EsDriver = require('../src/config/esConfig')

/*
    Schema
    id: number = AutoIncrement [PrimaryKey]
    description: string = null
    type: string
    size: number
*/

async function emptyEs() {
    const es = new EsDriver(env);

    console.log("Please wait, can take a few seconds...")
    try {
        // ES delete
        await es.connect()
        if ((await es.client.indices.exists({index: esConfig.es_index}))) {
            await es.client.indices.delete({ index: esConfig.es_index})
            es.disconnect()
        }
    } catch (err) {
        console.log("ES DELETE FAILED:")
        console.log(err)
        es.disconnect()
    }
}

emptyEs();