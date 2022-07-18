import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import contractInterface from '../abi/GoblinHipsters.json';
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard';

const contractConfig = {
  addressOrName: '0xa1AA3dADc91C1d46E649Ab3AA7966b751bF5ec6c',
  contractInterface: contractInterface,
};

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = useState(0);
  const { address: walletAddress, isConnected } = useAccount();

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({ ...contractConfig, functionName: 'mint' });

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
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

  return (
    <div className="page">
      <div className="container">
        <div style={{ flex: '1 1 auto' }}>
          <div style={{ padding: '24px 24px 24px 0' }}>
            <h1 className="text-4xl font-bold">Goblin Hipsters</h1>
            <p style={{ margin: '12px 0 24px' }}>
              {totalMinted} minted so far!
            </p>
            <ConnectButton />

            {mintError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: '#FF6257' }}>
                Error: {txError.message}
              </p>
            )}

            {(isConnected && !isMinted) && (
              <button
                style={{ marginTop: 24 }}
                disabled={isMintLoading || isMintStarted || isMinted}
                className={`button hidden ${(!isConnected || isMinted) && 'hidden'}`}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mint({
                  args: [
                    walletAddress,  // owner's wallet address
                    1    // TODO change this value to mint more than 1
                  ]
                })}
              >
                {isMintLoading && 'Waiting for approval'}
                {!isMinted && isMintStarted && 'Minting...'}
                {!isMintLoading && !isMintStarted && 'Mint'}
              </button>
            )}
              
          </div>
        </div>

        <div style={{ flex: '0 0 auto' }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
              <Image
                layout="responsive"
                src="/nft/blue.png"
                width="500"
                height="500"
                alt="Ghotter NFT"
              />
              <h1 style={{ marginTop: 24 }}>Ghotters Project</h1>
              <ConnectButton />
            </FrontCard>
            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                <Image
                  src="/nft/blue.png"
                  width="80"
                  height="80"
                  alt="Ghotter NFT"
                  style={{ borderRadius: 8 }}
                />
                <h2 className="font-bold" style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                <p style={{ marginBottom: 24 }}>
                  Your NFT will show up in your wallet in the next few minutes.
                </p>
                <p style={{ marginBottom: 6 }}>
                  View on{' '}
                  <a className='font-semibold' href={`https://rinkeby.etherscan.io/tx/${mintData?.hash}`}>
                    Etherscan
                  </a>
                </p>
                <p>
                  View on{' '}
                  <a  className='font-semibold' 
                    href={`https://testnets.opensea.io/assets/rinkeby/${mintData?.to}/1`}
                  >
                    Opensea
                  </a>
                </p>
              </div>
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
