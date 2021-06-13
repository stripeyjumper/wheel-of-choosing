import React from "react";
import { motion } from "framer-motion";

const ExpandingButton = (props: any) => (
  <motion.button
    whileHover={{ scale: props.disabled ? 1 : 1.05 }}
    whileTap={{ scale: props.disabled ? 1 : 0.95 }}
    {...props}
  />
);

export default ExpandingButton;
