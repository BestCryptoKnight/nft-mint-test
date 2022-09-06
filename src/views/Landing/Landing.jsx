import { Box } from "@mui/material";
import "./Landing.scss";
import { useState, useEffect } from "react";
import PassNFTABI from "../../abis/PassNFTABI.json";
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks";
import _ from "lodash";
import { MintAddress } from "../../constants";
import styled from "styled-components";
import {FadeLoader} from "react-spinners"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCountdown } from '../../hooks/useCountdown';

const targetDate = 1 * 1000;

function Landing() {
  const { provider, address } = useWeb3Context();
  const [isLoading, setLoding] = useState(false)
  const [curTime, setCurTime] = useState(0)
  const [days, hours, minutes, seconds] = useCountdown(curTime);
  const [nftCount, setNFTCount] = useState("--");

  useEffect(()=>{
    if(!address) {
      setCurTime(0)
      return;
    }
    setCurTime(targetDate + new Date().getTime())
    getCount()
  }, [address])

  console.log(days, hours, minutes, seconds)

  const mint = async() => {
    if(!address) {
      toast("Please connect to your wallet!");
      return;
    }
    const signer = provider.getSigner();
    const mintContract = new ethers.Contract(MintAddress, PassNFTABI, signer);
    setLoding(true)
    try {
      const tx = await mintContract.mint(address, { value: ethers.utils.parseEther("0") })
      await tx.wait();
      toast("Successfully Minted!");
      getCount();
    } catch (e) {
      toast("Transaction Failed! Try again.");
    } finally {
      setLoding(false)
    }
  }

  const getCount = async() => {
    if(!address) {
      return;
    }
    const signer = provider.getSigner();
    const mintContract = new ethers.Contract(MintAddress, PassNFTABI, signer);
    try {
      const tx = await mintContract.balanceOf(address)
      console.log("============",tx)
      setNFTCount(tx.toString());
    } catch (e) {
      toast("Something went wrong!");
    } finally {
    }
  }

  const renderButton = () => {
    return !isLoading ? "Mint" : 
        <Box display="flex" justifyContent="center" alignItems="center">
          <FadeLoader color="#36d7b7" width={2} height={8} margin={-6} style={{top:0, left:0, width:0, height: 0, position: 'relative'}} />
        </Box>
  }

  const renderComponent = () => {

    if (days + hours + minutes + seconds <= 0) {
      return <Box display="flex" flexDirection="column">
        <Box mb="50px">Your NFT Count: {nftCount}</Box>
        <CustomButton onClick={mint} disabled={isLoading}>{renderButton()}</CustomButton>
      </Box>
    } else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  }
  
  return (
    <Box id="landing-view" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      {renderComponent()}
      <ToastContainer />
    </Box>
  );
}

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <ShouwCounterWraper>
      <div
        className="countdown-link"
      >
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </div>
    </ShouwCounterWraper>
  );
};

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? 'countdown danger' : 'countdown'}>
      <p>{value}</p>
      <span>{type}</span>
    </div>
  );
};

const CustomButton = styled.button`
  width: 220px;
    height: 50px;
    border: none;
    outline: none;
    color: #fff;
    background: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 5px;

    :before{
      content: '';
      background: linear-gradient(45deg, #ff000088, #ff730088, #fffb0088, #48ff0088, #00ffd588, #002bff88, #7a00ff88, #ff00c888, #ff000088);
      position: absolute;
      top: -2px;
      left:-2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      animation: glowing 20s linear infinite;
      opacity: 0;
      transition: opacity .3s ease-in-out;
      border-radius: 5px;
    }

    :active{
      color: white
    }

    :active:after{
      background: transparent;
    }

    :hover:before{
      opacity: 1;
    }

    :after {
      z-index: -1;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: #4a4a4a;
      left: 0;
      top: 0;
      border-radius: 5px;
    }
    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }

`
export default Landing;

const ShouwCounterWraper = styled.div`
  padding: 0.5rem;
  .countdown {
    line-height: 1.25rem;
    padding: 0 0.75rem 0 0.75rem;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .countdown.danger {
    color: #ff0000;
  }
  .countdown > p {
    margin: 0;
  }
  .countdown > span {
    text-transform: uppercase;
    font-size: 1rem;
    line-height: 1.25rem;
  }
  .countdown-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 2rem;
    padding: 0.5rem;
    border: 1px solid #ebebeb;
    border-radius: 0.25rem;
    text-decoration: none;
    color: #000;  
  }
`