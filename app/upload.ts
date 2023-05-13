
// // export const uploadJson = (data: unknown): Promise<string> => {
// //     const serialized = JSON.stringify(data);
    
// //     const url = "http://127.0.0.1:8080";
          
// //     return url;
// //   }


//   export const uploadJson = async (data: unknown): Promise<string> => {
//     const serialized = JSON.stringify(data);
  
//     // Replace this with your actual API endpoint for uploading the data
//     const apiEndpoint = "https://ipfs.io/harmonylens/ipns/k51qzi5uqu5dm3hhnuodkcoj1kw8tfp6q00szi5vobvq5mmqnpqr09bol9yhzj";
  
//     // Upload the serialized data using a fetch request
//     const response = await fetch(apiEndpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: serialized,
//     });

//     console.log(response)
  
//     if (!response.ok) {
//       throw new Error("Error uploading the data");
//     }
  
//     // Get the public URL of the uploaded data from the API response
//     const responseData = await response.json();
//     const url = responseData.publicUrl;
  
//     return url;
//   };
  
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import { fetchSigner } from 'wagmi/actions';
import { never } from '../utils';


const TOP_UP = '10000000000000000'; // 0.1 MATIC
const MIN_FUNDS = 0.05;

async function getBundlr() {
  const signer = (await fetchSigner()) ?? never('Cannot get signer');
  const provider = signer?.provider ?? never('Cannot get provider');

  if (provider instanceof providers.JsonRpcProvider) {
    await provider.send('wallet_switchEthereumChain', [{ chainId: utils.hexValue(80001) }]);
  }

  const bundlr = new WebBundlr('https://devnet.bundlr.network', 'matic', signer?.provider, {
    providerUrl: 'https://rpc-mumbai.maticvigil.com/',
  });

  console.log(bundlr)

  await bundlr.ready();

//   const balance = await bundlr.getBalance((await signer?.getAddress()) ?? never());

  await bundlr.fund(TOP_UP);

//   console.log(bundlr.utils.toAtomic(balance))

//   if (bundlr.utils.unitConverter(balance).toNumber() < MIN_FUNDS) {
//     await bundlr.fund(TOP_UP);
//   }

  return bundlr;
}
export async function uploadJson(data: unknown): Promise<string> {
  const confirm = window.confirm(
    `In this example we will now upload metadata file via the Bundlr Network.

Please make sure your wallet is connected to the Polygon Mumbai testnet.

You can get some Mumbai MATIC from the Mumbai Faucet: https://mumbaifaucet.com/`,
  );

  if (!confirm) {
    throw new Error('User cancelled');
  }

  const bundlr = await getBundlr();

  const serialized = JSON.stringify(data);
  const tx = await bundlr.upload(serialized, {
    tags: [{ name: 'Content-Type', value: 'application/json' }],
  });

  return `https://arweave.net/${tx.id}`;
}
