import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SIDEBAR_WIDTH = '15rem'; // Increased width for better visibility

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #1a1f25; /* Darker background color */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 0 0 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  margin: 0;
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  margin-top: 20px;

  a {
    color: white;
    margin: 10px 0;
    text-decoration: none;
    font-size: 18px;
    width: 100%;
    padding: 10px 0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Title = styled.h2`  text-align: center;
  margin: 0;
  padding: 0 10px;
`;

// Add this to ensure content doesn't go under the sidebar
const SidebarSpacer = styled.div`
  width: ${SIDEBAR_WIDTH};
  flex-shrink: 0;
`;

const Sidebar: React.FC = () => {
  return (
    <>
      <SidebarContainer>
        <Title>Weather Dashboard</Title>
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/cities">Cities</Link>
        </NavLinks>
      </SidebarContainer>
      <SidebarSpacer />
    </>
  );
};

export default Sidebar; 
