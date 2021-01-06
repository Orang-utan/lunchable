import { useEffect, useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 225px;
  height: 30px;
  padding: 10px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 8px;
  margin: 0px 0px 20px 0px;

  &:focus {
    outline: none;
  }
`;

const CollapsibleInput = ({ input, setInput }) => {
  return (
    <>
      {input.show ? <Input placeholder="Search for Past Links"></Input> : <></>}
    </>
  );
};

export default CollapsibleInput;
