import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    height: calc(100vh - 1rem);

    > div {
      position: absolute;
      left: 0;
      top: 0;
      max-height: calc(100vh - 1rem);
    }
  }

  @media (min-width: 768px) and (min-height: 700px) {
    height: calc(100vh - 3rem);

    > div {
      position: absolute;
      left: 0;
      top: 0;
      max-height: calc(100vh - 3rem);
    }
  }
  overflow: hidden;
`;

const variants = {
  enter: (direction: number) => {
    return {
      y: direction * 2000,
      opacity: 0,
    };
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      y: direction * -2000,
      opacity: 0,
    };
  },
};

function VerticalScrollAnimation({
  children,
  id,
  scrollDirection,
  enabled = true,
}: {
  children: React.ReactNode;
  scrollDirection: "up" | "down" | null;
  id: any;
  enabled?: boolean;
}) {
  let direction = 0;
  if (scrollDirection) {
    direction = scrollDirection === "up" ? -1 : 1;
  }

  return enabled ? (
    <ScrollContainer>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={id}
          variants={variants}
          initial={"enter"}
          animate={"center"}
          exit={"exit"}
          custom={direction}
          transition={{
            y: { type: "spring", stiffness: 500, damping: 60 },
            opacity: { duration: 0.2 },
          }}
          style={{
            width: "100%",
            maxHeight: "calc(100vh - 3rem)",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ScrollContainer>
  ) : (
    <>{children}</>
  );
}

export default VerticalScrollAnimation;
