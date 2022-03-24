import React from 'react'
import { useState } from 'react'
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Nav,Logo,MenuIcon, Menu, NavLinks } from './NavUser.style';
import Button from '@mui/material/Button';

function Navbar() {

  const [isClicked, setIsClicked] = useState(false);

  return (
    <Nav>
      <Logo href="">
        E<span>co</span>F<span>resh</span>
      </Logo>

      <MenuIcon onClick={() => setIsClicked(!isClicked)}>
        <span />
        <span />
        <span />
      </MenuIcon>
      
      <Menu isClicked={isClicked}>
        <NavLinks to="/admin">Home</NavLinks>
        <NavLinks to="/admin">Orders</NavLinks>
        <NavLinks to="/admin">Pantry</NavLinks>
        <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Logout
          </Button>
        <div className="button_container">
          <AccButton />
        </div>
      </Menu>
      <div className="button_container">
          <AccButton />
        </div>
    </Nav>
  )
}

const AccButton = () => {
  return <button className="buttons"><AccountCircleRoundedIcon /></button>;
};

export default Navbar