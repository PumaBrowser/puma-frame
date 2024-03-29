import { Html, Head, Main, NextScript } from "next/document";
import { config } from "@/config/config";
import { FrameMetadata } from "@coinbase/onchainkit";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content={`Follow ${config.warpcast.userHandles
            .map((handle) => handle)
            .join(", ")} on Warpcast to claim`}
        />
        <meta
          property="og:image"
          content={`https://${config.hostUrl}/image.png`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body>
        <Main />
        <FrameMetadata
          image={`https://${config.hostUrl}/image.png`}
          postUrl={`https://${config.hostUrl}/api/mint?type=start`}
          buttons={[
            {
              label: "Get Started",
            },
          ]}
        />
        <NextScript />
      </body>
    </Html>
  );
}
