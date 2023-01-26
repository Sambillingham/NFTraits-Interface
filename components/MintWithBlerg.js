import React from "react";
import { ethers } from "ethers";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useContractReads,
  useWaitForTransaction
} from "wagmi";
import ContractInterfaceBlergs from "../Blergs.json";
import ContractInterfaceTraits from "../NFTraits.json";

const MintMain = ({ title, desc, setMintType, emitError, emitLoading, emitRequestId }) => {
  const [mounted, setMounted] = React.useState(false);
  const [totalBlergs, setTotalBlergs] = React.useState(0);
  const [tokenList, setTokenList] = React.useState([]);
  const [usedMintList, setUsedMintList] = React.useState([]);
  const [selectedBlerg, setSelectedBlerg] = React.useState(null);
  const [pendingTx, setPendingTx] = React.useState(true);

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const activeSeason = 1;

  const blergsContract = {
    addressOrName: "0x79eD15Afb913e71cb5FF2624B00A696292E148b0",
    contractInterface: ContractInterfaceBlergs.abi,
  };

  const traitsContract = {
    addressOrName: "0x0a0BaB951Bc81367376c61caF2476459f9C8e9F9",
    contractInterface: ContractInterfaceTraits.abi,
  };

  const {
    data: blergBal,
    error: balanceReadError,
    isError: isBalanceReadError,
  } = useContractRead({
    ...blergsContract,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const {
    data: tokenIdList,
    error: tokenListError,
    isError: isTokenListError,
  } = useContractReads({
    contracts: [
      ...[...Array(totalBlergs)].map((x, i) => {
        return {
          ...blergsContract,
          functionName: "tokenOfOwnerByIndex",
          args: [address, i],
        };
      }),
    ],
    watch: true,
  });

  const {
    data: freeMintList,
    error: freeMintListError,
    isError: isFreeMintListError,
  } = useContractReads({
    contracts: [
      ...tokenList.map((x, i) => {
        return {
          ...traitsContract,
          functionName: "BlergFreeMints",
          args: [x, activeSeason],
        };
      }),
    ],
    watch: true,
  });

  const { config: configTraits } = usePrepareContractWrite({
    ...traitsContract,
    functionName: "mintTraitsWithBlerg",
    args: [tokenList[selectedBlerg]],
    overrides: {
      gasLimit: 400000,
    },
  });

  const {
    write: mintTraits,
    data: result,
    error,
    isError,
    isLoading,
  } = useContractWrite(configTraits);

  if (isLoading && pendingTx) {
    emitLoading(true);
  }

  if (isError && pendingTx) {
    emitError(JSON.stringify(error))
    setPendingTx(false)
    emitLoading(false);
  }

  const { data: txResult, isSuccess: txComplete } = useWaitForTransaction({
    hash: result?.hash,
  });

  if (txComplete && txResult.status === 1) {
    const iface = new ethers.utils.Interface(ContractInterfaceTraits.abi);
    const log = iface.parseLog(txResult.logs[3]);
    emitRequestId(log.args.requestId.toString());
  }
  
  if (txComplete && txResult?.status !== 1) {
    emitLoading(false);
    emitError(JSON.stringify({ reason: "TX Failed" }))
  }


  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (blergBal) setTotalBlergs(blergBal.toNumber());
    if (tokenIdList) setTokenList(tokenIdList.map((x) => x.toNumber()));
    if (freeMintList) setUsedMintList(freeMintList);
  }, [blergBal, tokenIdList, freeMintList]);

  return (
    <article className="flex h-full flex-col border-2 border-slate-800 bg-slate-50 px-4 py-4 shadow-solid shadow-slate-800">
      <h1 className="mb-2 text-4xl font-bold">{title}</h1>
      <p className="mb-4 text-base">{desc}</p>
      <div className="flex-grow">
        <ul className="max-h-48 list-none overflow-scroll border p-4 pl-4">
          {tokenList.map((x, i) => (
            <li
              onClick={() => setSelectedBlerg(i)}
              className={`cursor-pointer list-none border p-4 ${
                selectedBlerg === i ? "bg-slate-800 text-white" : ""
              }`}
              key={x}
            >
              Blerg #{x} &middot;
              {usedMintList[i] ? "Used" : "Available"}
            </li>
          ))}
        </ul>
      </div>
      {mounted && isConnected && (
        <div>
          <button
            disabled={selectedBlerg === null || usedMintList[selectedBlerg]}
            className="block w-full bg-slate-800 px-8 py-4 text-center uppercase text-white shadow-solid shadow-slate-400 disabled:cursor-not-allowed disabled:opacity-10"
            onClick={() => mintTraits?.()}
          >
            Mint Pack w Blerg - #{tokenList[selectedBlerg]}
          </button>
          <h3
            onClick={() => setMintType("main")}
            className="mt-2 cursor-pointer text-center text-xl"
          >
            {" "}
            &larr; Back to main Mint{" "}
          </h3>
        </div>
      )}
      {mounted && !isConnected && (
        <div>
          <button
            className="block w-full bg-slate-800 px-8 py-4 text-center uppercase text-white shadow-solid shadow-slate-400"
            onClick={openConnectModal}
          >
            Connect
          </button>
        </div>
      )}
    </article>
  );
};

export default MintMain;
