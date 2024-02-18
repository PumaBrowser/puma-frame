export const config = {
  neynar: {
    apiKey: process.env.NEYNAR_API_KEY,
  },
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  warpcast: {
    userHandles: [
      process.env.NEXT_PUBLIC_USER_HANDLE_1,
      process.env.NEXT_PUBLIC_USER_HANDLE_2,
    ], // Farcaster USER_HANDLEs to follow to be eligible for mint
    fIds: [process.env.NEXT_PUBLIC_FID_1, process.env.NEXT_PUBLIC_FID_2], // Farcaster USER_IDs to follow to be eligible for mint
  },
  hostUrl: process.env.NEXT_PUBLIC_HOST_URL,
  thirdweb: {
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    engine: {
      url: process.env.THIRDWEB_ENGINE_URL,
      wallet: process.env.THIRDWEB_ENGINE_WALLET,
      accessToken: process.env.THIRDWEB_ENGINE_ACCESS_TOKEN,
    },
  },
};
