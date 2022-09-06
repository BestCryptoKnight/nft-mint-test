import React, { useState, useContext, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { EnvHelper } from "../helpers/Environment";

function getTestnetURI() {
  return "https://rinkeby.infura.io/v3/e3860096f23a47a9810310d88fec50e9";
}

function getMainnetURI() {
  return "https://mainnet.infura.io/v3/e3860096f23a47a9810310d88fec50e9";
}

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

// define useAddress() hook
export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(1);
  const [address, setAddress] = useState("");

  const [uri, setUri] = useState(getMainnetURI());

  const [provider, setProvider] = useState(new StaticJsonRpcProvider(uri));

  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              4: 'https://rinkeby.infura.io/v3/e3860096f23a47a9810310d88fec50e9'
            },
            chainID: 4
          },
        },
      },
    }),
  );

  const hasCachedProvider = () => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }
      // when wallet account is changed
      rawProvider.on("accountsChanged", async (accounts) => {
        setTimeout(() => window.location.reload(), 1);
      });
      // when chainId is changed
      rawProvider.on("chainChanged", async (chain) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  const _checkNetwork = (otherChainID) => {
    console.error(
      "You are switching networks",
      EnvHelper.getOtherChainID(),
      otherChainID === EnvHelper.getOtherChainID() || otherChainID === 4,
    );
    // when chainID is not test-BSC, it will return false and processes are halt.
    if (chainID !== otherChainID) {
      console.warn("You are switching networks", EnvHelper.getOtherChainID());
      if (otherChainID === EnvHelper.getOtherChainID() || otherChainID === 4) {
        setChainID(otherChainID);
        otherChainID === EnvHelper.getOtherChainID() ? setUri(getMainnetURI()) : setUri(getTestnetURI());
        return true;
      }
      return false;
    }
    return true;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    const rawProvider = await web3Modal.connect();
    await web3Modal.toggleModal();
    _initListeners(rawProvider);
    const connectedProvider = new Web3Provider(rawProvider, "any");

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      alert("Wrong network, please switch to bsc testnet")
      console.error("Wrong network, please switch to bsc mainnet");
      return;
    }

    setProvider(connectedProvider);
    setAddress(connectedAddress);
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    console.log("disconnecting");
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
