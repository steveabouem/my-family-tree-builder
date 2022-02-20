import styled from "styled-components";

export const StyledHouseholdBubble = styled.div`
  position: absolute;
  width: 40%;
  margin: 4% 30%;
  background: #aab73a47;
  background-image: url(https://us.123rf.com/450wm/yupiramos/yupiramos1803/yupiramos180306406/96847704-house-with-garden-vector-illustration.jpg?ver=6);
  border-radius: 96%;
  height: 445px;
  background-position: center;
  background-blend-mode: overlay;
  opacity: .6;
`;

export const StyledLoginContainer = styled.div`
  position: absolute;
  left: 25%;
  width: 50%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  top: 15%;
  height: 60%;
  
  form {
    height: 75%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    background: url(https://images.unsplash.com/photo-1498262257252-c282316270bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80);
    background-size: cover;
    background-color: #673ab76e;
    background-blend-mode: overlay;
    
    > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      label {
        color: white;
        font-size: 1.2em;
      }
    }
  }
`;