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
  addressOrName: "0xa1AA3dADc91C1d46E649Ab3AA7966b751bF5ec6c",
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
      <div>{memoizedBG}</div>
      <div className="page" style={{ position: "relative", zIndex: 1 }}>
        <div className="fixed z-10 -translate-x-1/2 top-4 left-1/2">
          <Image
            className="cursor-pointer"
            src="/resources/play.png"
            width={80}
            height={80}
            alt=""
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="container justify-center items-center overflow-y-scroll">
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
                  <div style={{ padding: 24 }}>
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
                    <p style={{ marginBottom: 24 }}>
                      Your NFT will show up in your wallet in the next few
                      minutes.
                    </p>
                    <p style={{ marginBottom: 6 }}>
                      View on{" "}
                      <a
                        className="font-semibold"
                        href={`https://etherscan.io/tx/${mintData?.hash}`}
                      >
                        Etherscan
                      </a>
                    </p>
                    <p>
                      View on{" "}
                      <a
                        className="font-semibold"
                        href={`https://testnets.opensea.io/assets/${mintData?.to}/1`}
                      >
                        Opensea
                      </a>
                    </p>
                  </div>
                </BackCard>
              </FlipCard>
            </div>
            <p className="text-4xl font-bold stroke goblet">
              {/* {totalMinted} Minted / 10000 */}0 Minted / 10000
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
                      1, // TODO change this value to mint more than 1
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
                    {!isMintLoading && !isMintStarted && "Mint"}
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
