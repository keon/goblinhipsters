import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../abi/GoblinHipsters.json";
import FlipCard, { BackCard, FrontCard } from "../components/FlipCard";
import Head from "../components/Head";
import useCountdown from "../hooks/useCountdown";
import ModalVideo from "react-modal-video";
import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("../components/BG/BG.js"), {
  ssr: false,
});

function BG() {
  return <NoSSRComponent />;
}

const contractConfig = {
  addressOrName: "0x61Ed568becd4D5f58782EdeB05AB3872E0222e81",
  contractInterface: contractInterface,
};

const START_TIME = 1659279600000;

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = useState(0);
  const { address: walletAddress, isConnected } = useAccount();
  const [isOpen, setOpen] = useState(true);
  const remaining = useCountdown(START_TIME);

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({ ...contractConfig, functionName: "mint" });

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: "totalSupply",
    watch: true,
  });

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;

  const memoizedBG = React.useMemo(() => <BG />, []);

  return (
    <>
      <Head />
      <div>{memoizedBG}</div>
      <div className="page" style={{ position: "relative", zIndex: 1 }}>
        <div className="fixed z-10 -translate-x-1/2 top-4 left-1/2 flex items-center">
          <Image
            className="cursor-pointer"
            src="/resources/play.png"
            width={80}
            height={80}
            alt=""
            onClick={() => setOpen(true)}
          />

          <Image
            className="cursor-pointer ml-2 mr-2"
            src="/resources/opensea.png"
            width={70}
            height={70}
            alt=""
            onClick={() =>
              window.open(
                "https://opensea.io/collection/goblin-hipsters",
                "_blank"
              )
            }
          />

          <Image
            className="cursor-pointer"
            src="/resources/twitter.png"
            width={70}
            height={70}
            alt=""
            onClick={() =>
              window.open("https://twitter.com/GoblinHipsters", "_blank")
            }
          />
        </div>
        <div className="container items-center justify-center">
          <div className="flex flex-col items-center">
            {/* <h1 className="text-4xl font-bold">Goblin Hipsters</h1> */}
            {/* <div className="video-container">
              <video className="video" autoPlay loop controls>
                <source src="/resources/goblin.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div> */}

            <Image
              objectFit="contain"
              src="/resources/logo.png"
              width={300}
              height={300}
              alt=""
            />

            <div className="-mt-12">
              <FlipCard>
                <FrontCard isCardFlipped={isMinted}>
                  <Image
                    layout="responsive"
                    src="/egg-transparent.png"
                    width="200"
                    height="200"
                    objectFit="contain"
                    alt="Goblin Hipsters"
                  />
                  <ConnectButton />
                </FrontCard>
                <BackCard isCardFlipped={isMinted}>
                  <div
                    style={{ padding: 24 }}
                    className="text-center text-white"
                  >
                    <Image
                      src="/egg-transparent.png"
                      width="80"
                      height="80"
                      alt="Goblin Hipsters NFT"
                      style={{ borderRadius: 8 }}
                    />
                    <h2
                      className="font-bold"
                      style={{ marginTop: 24, marginBottom: 6 }}
                    >
                      NFT Minted!
                    </h2>
                    <p>
                      Your NFT will show up in your wallet in the next few
                      minutes.
                    </p>
                    <div
                      style={{ marginTop: 6 }}
                      className="flex items-center justify-center text-center"
                    >
                      <a
                        className="relative mr-1 button"
                        href={`https://etherscan.io/tx/${mintData?.hash}`}
                        target="_blnk"
                      >
                        Etherscan
                      </a>
                      <a
                        className="relative ml-1 button"
                        href={`https://opensea.io/assets/${mintData?.to}/1`}
                        target="_blnk"
                      >
                        Opensea
                      </a>
                    </div>
                  </div>
                </BackCard>
              </FlipCard>
            </div>
            <p className="text-4xl font-bold stroke goblet">
              {totalMinted} Minted / 10000
            </p>

            <div className="mt-4">
              <ConnectButton />
            </div>

            {mintError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {txError.message}
              </p>
            )}

            {isConnected && !isMinted && (
              <button
                style={{ marginTop: 24 }}
                disabled={
                  isMintLoading || isMintStarted || isMinted || remaining
                }
                className={`button hidden ${
                  (!isConnected || isMinted) && "hidden"
                } ${remaining && "cursor-not-allowed"}`}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() =>
                  mint({
                    args: [
                      walletAddress, // owner's wallet address
                      5, // TODO change this value to mint more than 1
                    ],
                  })
                }
              >
                {remaining ? (
                  <>{remaining}</>
                ) : (
                  <>
                    {isMintLoading && "Waiting for approval"}
                    {!isMinted && isMintStarted && "Minting..."}
                    {!isMintLoading && !isMintStarted && "Mint 5"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <ModalVideo
        channel="custom"
        url="/resources/goblin.mp4"
        autoplay
        loop
        isOpen={isOpen}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default Home;
