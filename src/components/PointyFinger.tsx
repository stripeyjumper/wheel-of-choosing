import { faHandPointLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";

const variants = {
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: { type: "spring", damping: 20, duration: 1 },
      opacity: { duration: 1 },
    },
  },
  hide: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.1 },
  },
};

function PointyFinger({ showPointer }: { showPointer: boolean }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(showPointer ? "show" : "hide");
  }, [showPointer, controls]);

  return (
    <motion.g
      opacity={showPointer ? 1 : 0}
      variants={variants}
      initial={showPointer ? "show" : "hide"}
      animate={controls}
    >
      <FontAwesomeIcon
        icon={faHandPointLeft}
        width={20}
        height={20}
        x={195}
        y={92}
        color="#fff"
      />
    </motion.g>
  );
}

export default PointyFinger;
