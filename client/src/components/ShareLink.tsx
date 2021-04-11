import { faCopy, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ShareLinkButton = styled.button`
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
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
  font-size: 14pt;
  outline: none;
`;

const ShareLinkPanel = styled.div`
  background-color: #fff;
  color: #333;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const CopyToClipboardButton = styled.button`
  text-align: left;
  border: none;
  color: #115da8;
  background-color: transparent;
  outline: none;
  text-decoration: none;
  cursor: pointer;
`;

const LinkInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #115da8;
  border-radius: 0.5rem;
`;

const ShareLinkHeader = styled.h5`
  margin-top: 0;
  margin-bottom: 0.2rem;
  color: #333;
`;

function ShareLink({ serializedState }: { serializedState: string | null }) {
  const [showTextbox, setShowTextbox] = useState(false);
  const inputRef = useRef<any>(null);

  const handleShareLink = useCallback(() => {
    setShowTextbox(true);
  }, []);

  useEffect(() => {
    if (showTextbox && inputRef.current) {
      inputRef.current.select();
    }
  }, [showTextbox]);

  return (
    <>
      <ShareLinkButton onClick={handleShareLink} type="button">
        <FontAwesomeIcon icon={faShare} /> Share link
      </ShareLinkButton>
      {showTextbox ? (
        <ShareLinkPanel>
          <ShareLinkHeader>Share a link to these wheels</ShareLinkHeader>
          <LinkInput
            ref={inputRef}
            value={`http://localhost:3000?wheels=${serializedState}` || ""}
            readOnly={true}
            onFocus={() => {
              inputRef.current && inputRef.current.select();
            }}
          />
          <CopyToClipboardButton
            type="button"
            onClick={() => console.log("Ok here!")}
          >
            <FontAwesomeIcon icon={faCopy} /> Copy to clipboard
          </CopyToClipboardButton>
        </ShareLinkPanel>
      ) : null}
    </>
  );
}

export default ShareLink;
