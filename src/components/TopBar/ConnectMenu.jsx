import { useEffect, useState } from "react";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import styled from 'styled-components'
import {Box} from '@mui/material'

function ConnectMenu({ bigType = false }) {
  const { connect, disconnect, connected, web3 } = useWeb3Context();
  const address = useAddress();
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  let ellipsis = address
    ? address.slice(0, 2) +
    "..." +
    address.substring(address.length - 4, address.length)
    : "Connect Wallet";

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  const buttonStyles =
    "pending-txn-container" + (isHovering );

  useEffect(() => {
    // if (address) {
    //   connect();
    // }
  }, [address]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      className="wallet-menu"
      id="wallet-menu"
    >
      <ConnectButton bigType={bigType}
        className={buttonStyles}
        variant="contained"
        color="secondary"
        size="large"
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {ellipsis}
      </ConnectButton>
    </div>
  );
}

const ConnectButton = styled(Box)`
    ${({ bigType }) => bigType ? 'width: 100%; height: 48px' : 'height: 32px'};
    align-items: center;
    border-radius: 5px;
    box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.03em;
    line-height: 1;
    justify-content: center;
    opacity: 1;
    padding: 0px 16px;
    outline: 0px;
    background-color: rgb(239, 183, 0);
    color: white;

    &:hover {
      opacity: .5;
    }
`;

export default ConnectMenu;
