import { motion } from "framer-motion";
import styled from "styled-components";

const ExpandingButton = (props: any) => (
  <motion.button
    whileHover={{ scale: props.disabled ? 1 : 1.05 }}
    whileTap={{ scale: props.disabled ? 1 : 0.95 }}
    {...props}
  />
);

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
