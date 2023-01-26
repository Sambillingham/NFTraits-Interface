import React from "react";
import { ethers } from "ethers";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import ContractInterfaceTraits from "../NFTraits.json";

const MintMain = ({
  title,
  setMintType,
  emitError,
  emitLoading,
  emitRequestId
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [pendingTx, setPendingTx] = React.useState(true);

  const [totalSupply, setTotalSupply] = React.useState(0);

  const {isConnected } = useAccount();

  const { openConnectModal } = useConnectModal();

  React.useEffect(() => setMounted(true), []);

  const traitsContract = {
    addressOrName: "0x0a0BaB951Bc81367376c61caF2476459f9C8e9F9",
    contractInterface: ContractInterfaceTraits.abi,
  };

  const { data: batchesMinted } = useContractRead({
    ...traitsContract,
    functionName: "batchesMinted",
    watch: true,
  });

  React.useEffect(() => {
    if (batchesMinted) {
      setTotalSupply(batchesMinted.toNumber());
    }
  }, [batchesMinted]);

  const { config: configTraits } = usePrepareContractWrite({
    ...traitsContract,
    functionName: "mintTraits",
    overrides: {
      value: ethers.utils.parseEther("0.001"),
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

  const activeSeason = 1;
  const seasonStaus = "Open";
  const availableInSeason = 1000;

  const emitMintTraits = () => {
    setPendingTx(true)
    mintTraits()
  }

  return (
    <article className="flex h-full flex-col justify-between  border-2 border-slate-800 bg-slate-50 px-4 py-4 shadow-solid shadow-slate-800">
      <h1 className="py-4 text-center text-3xl font-bold uppercase">
        {title} {activeSeason} : {seasonStaus}
      </h1>
      <h2 className="mb-2  text-center text-8xl">
        {totalSupply}/{availableInSeason}
      </h2>
      <h3 className="mb-2  text-center text-2xl"> 0.001Ξ </h3>

      {mounted && isConnected && (
        <div>
          <button
            className="block w-full bg-slate-800 px-8 py-4 text-center uppercase text-white shadow-solid shadow-slate-400"
            onClick={() => emitMintTraits()}
          >
            Mint Pack (8)
          </button>
          <h3
            onClick={() => setMintType("blerg")}
            className="mt-2 cursor-pointer text-center text-xl"
          >
            {" "}
            Blerg Holder Mint &rarr;
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
