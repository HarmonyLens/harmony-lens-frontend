// const ipfs = ipfsClient(); // Connect to the local IPFS API
import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

/* configure Infura auth settings */
const projectId = '2PkQmYmFrUiXi7HQfdCkffG42Kc'
const projectSecret = '0aef8138c915c8bcfdaf7b3416608949'
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

/* Create an instance of the client */
const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
})

export async function uploadJson(data) {
    console.log('data: ', data)
    const added = await client.add(JSON.stringify(data))
    const uri = `ipfs://${added.path}`
    console.log('uri: ', uri)
    return uri
}
