import styled from "styled-components";
import ExpandingButton from "./ExpandingButton";

const BigButton = styled(ExpandingButton)`
  font-family: "Varela Round", sans-serif;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.5rem;
  border: none;
  background-color: #115da8;
  border: 3px solid #115da8;
  height: 3rem;

  color: white;
  font-size: 14pt;
  outline: none;
`;

export default BigButton;
