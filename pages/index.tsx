import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Content from "../components/Content";
import MintMain from "../components/MintMain";
import MintWithBlerg from "../components/MintWithBlerg";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import MintComplete from "../components/MintComplete";

import { useContractEvent } from "wagmi";
import ContractInterfaceTraits from "../NFTraits.json";

const Home: NextPage = () => {
  const [mintType, setMintType] = React.useState("main");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [requestIdPending, setRequestIdPending] = React.useState("");
  const [mintedBatch, setMintedbatch] = React.useState(null);

  const traitsContract = {
    addressOrName: '0x0a0BaB951Bc81367376c61caF2476459f9C8e9F9',
    contractInterface: ContractInterfaceTraits.abi,
  };

  useContractEvent({
    ...traitsContract,
    eventName: "MintRequestFulfilled",
    listener(node, label, owner) {
      console.log("MintRequestFulfilled", node, label, owner);

      const incomingId = node[0].toString();
      const incomingBatch = node[1].map((x) => x.toNumber());

      if (incomingId === requestIdPending) {
        setMintedbatch(incomingBatch);
      }
    },
  });

  const resetMint = () => {
    setMintedbatch(null)
    setLoading(null)
    setRequestIdPending('')
  }

  return (
    <div>
      <Head>
        <title>NFTraits</title>
        <meta name="NFTraits" content="By Blergs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute top-5 right-5">
        <ConnectButton />
      </div>

      <main className="container mx-auto flex min-h-screen px-4">
        <div className="flex flex-row self-center">
          <section className="basis-1/2 px-8">
            <Content
              title="NFTraits"
              subtitle="by BLERGS DAO"
              desc="NFTraits (or just Traits for short) are the building blocks of PFPs. Rather than minting a complete PFP, traits are minted instead and then equipped onto a collection that is built to be compatible with traits."
              list={[
                "Traits are minted in packs of 8.",
                "ERC 1155 contract type",
                "Full on-chain, CCO",
                "10k traits, but no max quantity for each non 1of1 trait within the collection.",
                "Minting will have seasons that are capped on mint qty or duration, whichever occurs first.",
              ]}
              link={{
                to: "http://notion.so/Traits-Whitepaper-c5f81db5a9b84c73ad2e89c2697eb77b",
                text: "Read The Whitepaper",
              }}
            />
          </section>
          <section className="basis-1/2 px-8">
            {mintType === "main" ? (
              <MintMain
                setMintType={setMintType}
                emitError={setError}
                emitLoading={setLoading}
                emitRequestId={setRequestIdPending}
                title="Season"
              />
            ) : (
              <MintWithBlerg
                title="Free Mint For Blerg Holders"
                desc="Each Blerg held in a wallet will increase the odds by 1.33x and give 1 free mint."
                setMintType={setMintType}
                emitError={setError}
                emitLoading={setLoading}
                emitRequestId={setRequestIdPending}
              />
            )}
          </section>
        </div>
        <ErrorMessage error={error} clearError={setError} />
        <Loading isLoading={loading && !error && !mintedBatch} id={requestIdPending} />
        <MintComplete batch={mintedBatch} resetMint={resetMint}/>
      </main>

      <footer className="absolute bottom-0 w-full py-4 text-center z-0">
        <a target="_blank" href="https://blergs.xyz" rel="noopener noreferrer">
          NFTraits Season 1 - By BlergsDAO
        </a>
      </footer>
    </div>
  );
};

export default Home;
