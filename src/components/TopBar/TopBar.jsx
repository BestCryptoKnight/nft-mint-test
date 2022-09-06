import { Box } from "@mui/material";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from 'styled-components'
import { useState, useEffect, useRef } from "react";
import "./topbar.scss";

function TopBar({ theme }) {
  const [hamburgeropen, setHamburgerOpen] = useState(false);

  const dialog = useRef();
  const hamburger = useRef();

  useEffect(() => {
    document.addEventListener('mouseup', function (event) {
      if (dialog.current && !dialog.current.contains(event.target) && !hamburger.current.contains(event.target)) {
        setHamburgerOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    console.log(hamburgeropen)
  }, [hamburgeropen])
  return (
    <StyledContainer >
      <Box display={'flex'} justifyContent={'space-between'} pr={'16px'} pl={'16px'}>
        <Box display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'}>
            <Box mr={'10px'} mt={'8px'}>
            </Box>

          </Box>
        </Box>
        <Box display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} height={'64px'} >
            <ConnectMenu theme={theme} />

          </Box>
        </Box>
      </Box>
    </StyledContainer >
  );
}
const StyledContainer = styled(Box)`
    width : 100%;
    background-color : rgb(236, 249, 255);
    padding : 0 20px;
    @media screen and (max-width : 450px){
      padding : 0;
    }
    @media screen and (max-width : 1175px){
        >div:nth-child(1)>div:nth-child(1)>div{
            justify-content : start;
            >div{
                width : fit-content;
                margin-left : 10px;
            }
        }
    }
    position : fixed;
    top : 0;
    z-index : 10;
`;

export default TopBar;
