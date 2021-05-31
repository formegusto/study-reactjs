import React from "react";
import styled, { css } from "styled-components";
import media from "./BoxMedia";

function StyledComponent() {
  return (
    <Box color="black">
      <Button>안녕하세요</Button>
      <Button inverted={true}>테두리만</Button>
    </Box>
  );
}

type StyledProps = {
  color?: string;
  inverted?: boolean;
};

const Box = styled.div<StyledProps>`
  background: ${(props) => props.color || "blur"};
  padding: 1rem;
  display: flex;

  width: 1024px;
  margin: 0 auto;

  ${media.desktop`width: 768px; height: 50px;`};
  ${media.tablet`width: 100%;`};
`;

const Button = styled.button<StyledProps>`
  background: white;
  color: black;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  ${(props) =>
    props.inverted &&
    css`
      background: none;
      border: 2px solid white;
      color: white;

      &:hover {
        background: white;
        color: black;
      }
    `};
  & + button {
    margin-left: 1rem;
  }
`;

export default StyledComponent;
