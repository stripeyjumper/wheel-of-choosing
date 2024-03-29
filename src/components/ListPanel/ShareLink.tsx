import {
  faCopy,
  faShare,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";

import { copyTextToClipboard } from "../../helpers/copy-text-to-clipboard";
import ExpandingButton from "../ExpandingButton";
import { useOutsideAlerter } from "../../helpers/use-outside-alerter";
import { setShowDataUrl } from "../../services/wheel-reducer";

const TopArrow = styled(({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="20"
      height="20"
    >
      <polygon points="10,0 20,20 0,20" />
    </svg>
  );
})`
  margin-left: auto;
  margin-right: auto;
  stroke: #fff;
  fill: #fff;
`;

const ShareLinkButton = styled.button<any>`
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3px;
  border-radius: 0.5rem;
  border: 3px solid #eee;
  height: 3rem;
  color: #115da8;
  background-color: #eee;
  :hover {
    background-color: #115da8;
    border-color: #115da8;
    color: white;
  }
  ${({ $open }) =>
    $open
      ? css`
          background-color: #115da8;
          border-color: #115da8;
          color: white;
        `
      : ""}
  font-size: 14pt;
  outline: none;

  ${({ disabled }) => (disabled ? css`` : "")}
`;

const ShareLinkPanel = styled.div`
  background-color: #fff;
  color: #333;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CopyToClipboardButton = styled(ExpandingButton)`
  text-align: left;
  border: none;
  color: #115da8;
  background-color: transparent;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  margin-right: auto;
`;

const LinkInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #115da8;
  border-radius: 0.5rem;
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const ShareLinkHeader = styled.h5`
  margin-top: 0;
  margin-bottom: 0.2rem;
  color: #333;
`;

function ShareLink({
  serializedState,
  countOfWheels,
}: {
  serializedState?: string | null;
  countOfWheels: number;
}) {
  const panelRef = useRef<any>(null);
  const [showTextbox, setShowTextbox] = useState(false);
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();

  const handleShareLink = useCallback(() => {
    setShowTextbox((prev) => !prev);
    dispatch(setShowDataUrl(true));
  }, [dispatch]);

  useEffect(() => {
    if (showTextbox && inputRef.current) {
      inputRef.current.select();
    }
  }, [showTextbox]);

  const url = useMemo(
    () =>
      `${window.location.origin}/?wheels=${
        serializedState ? encodeURIComponent(serializedState) : ""
      }`,
    [serializedState]
  );

  useOutsideAlerter(panelRef, () => {
    setShowTextbox(false);
  });

  // Limit the serialized string to 1024 characters
  const tooLong = !!serializedState && serializedState.length > 1024;

  return (
    <Wrapper ref={panelRef}>
      <ShareLinkButton
        disabled={!serializedState}
        onClick={handleShareLink}
        type="button"
        $open={showTextbox}
      >
        <FontAwesomeIcon icon={faShare} /> Share link
      </ShareLinkButton>
      {showTextbox ? (
        <>
          <TopArrow />
          <ShareLinkPanel>
            {tooLong ? (
              <p>
                <FontAwesomeIcon icon={faExclamationTriangle} /> There are too
                many names to create a link, sorry!
              </p>
            ) : (
              <>
                <ShareLinkHeader>
                  Share a link to{" "}
                  {countOfWheels > 1 ? "these wheels" : "this wheel"}
                </ShareLinkHeader>
                <LinkInput
                  ref={inputRef}
                  value={url}
                  readOnly={true}
                  onFocus={() => {
                    inputRef.current && inputRef.current.select();
                  }}
                />
                <CopyToClipboardButton
                  type="button"
                  onClick={() => copyTextToClipboard(url)}
                >
                  <FontAwesomeIcon icon={faCopy} /> Copy to clipboard
                </CopyToClipboardButton>
              </>
            )}
          </ShareLinkPanel>
        </>
      ) : null}
    </Wrapper>
  );
}

export default ShareLink;
