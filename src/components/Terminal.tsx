import { useState } from "react";
import { asciiSurfer, asciiTitle } from "../assets/ascii.js";
import "./Terminal.css";

const Terminal: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputValue);
    setInputValue("");
  };

  return (
    <div className="terminalContainer">
      <p>© WardVerc's not a corporation. All rights resurfed.</p>
      <div className="asciiContainer">
        <pre>{asciiTitle}</pre>
        <pre>{asciiSurfer}</pre>
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onBlur={(e) => e.target.focus()}
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Terminal;
