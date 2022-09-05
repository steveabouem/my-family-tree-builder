import styled, {keyframes} from "styled-components";
import {Nav} from "react-bootstrap";
// TODO: global design system might not be really compatible with styled components
const revealCircle = keyframes`
  from {
    transform: translateY(-15px);
    border-radius: 50px;
    height: 1px;
    width: 1px;
  }
`;

const revealTranslate = keyframes`
  from {
    transform: translateX(-10%);
    width: 1px;
    overflow: hidden;
  }
`;

export const StyledNav = styled(Nav)`
  display: inline-flex;
  width: 100%;
  height: 35px;
  max-height: 55px;
  border-bottom: .5px solid;
  justify-content: space-between;
  align-items: center;
  padding: 0;
    .topnav-section {
    width: 50%;
    height: 100%;
    display: inline-flex;
    
    &:nth-child(2) {
      justify-content: flex-end;
      div {
        text-align: right;
        padding: 0 5%;
        
        a {
          color: white;
          font-weight: bold;
          
          &:hover {
            color: #90cfcc;//light-green
          }
        }
      }
    }
    
    .top-logo-label {
      display: inline-flex;
      font-size: 1.5em;
      vertical-align: middle;
      margin: 0 10%;
      color: #fb9f73;//orange
      animation: ${revealTranslate} .5s ease;
    }
    
    .top-logo-main {
      height: 80%;
      position: absolute;
      top: 10%;
      left: 2%;
      animation: ${revealCircle} .5s ease;
    }
    
    .avatar-container {
      width: 40px;
      background: white;
      position: absolute;
      height: 100%;
      right: 5%;
      border-radius: 20px;
      cursor: pointer;
      
      .user-avatar-top {
        height: 100%;
        position: absolute;
        right: 25%;
        width: 50%;
      }
    }
  }
`;

export const StyledUserMenu = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #afe2e0; //lighter-green
    width: 220px;
    position: absolute;
    right: 1em;
    top: 40px;
    max-height: 240px;
  
    .user-menu-link {
      display: inline-flex;
      justify-content: space-between;
      width: 100%;
      padding: .5em;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: #0a0a0a;//primary
        border-bottom: .5px solid white;
        color: white;
      }
      
      .close-menu {
        padding: 2px;
        width: 25px;
        text-align: center;
        height: 25px;
      }
    }
`;