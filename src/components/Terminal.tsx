import { useState } from "react";
import { asciiSurfer, asciiTitle } from "../assets/ascii.js";
import CommandRenderer from "./CommandRenderer.tsx";

const preCommand = (
  <p className="text-cyan-400 mr-2">
    terminal-portfolio
    <span className="text-sky-600">
      {" "}
      git:(<span className="text-red-600">main</span>)
    </span>
    ~$
  </p>
);

const Terminal: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [commands, setCommands] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommands([...commands, inputValue]);
    setInputValue("");
  };

  return (
    <div className="font-mono">
      <p className="text-sm text-cyan-100 drop-shadow-[0_0_2px_rgb(34,211,238)]">
        © WardVerc's not a corporation. All rights resurfed.
      </p>
      <div className="flex">
        <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
          <pre>{asciiTitle}</pre>
        </span>
        <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
          <pre>{asciiSurfer}</pre>
        </span>
      </div>
      <p className="mb-8">Type 'help' for a list of available commands.</p>
      <div>
        <CommandRenderer
          commands={commands}
          clear={() => setCommands([])}
          preCommand={preCommand}
        />
      </div>
      <form onSubmit={onSubmit}>
        <p className="flex">
          {preCommand}
          <input
            type="text"
            className="outline-none bg-[var(--main-bg-color)]"
            onBlur={(e) => e.target.focus()}
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </p>
      </form>
    </div>
  );
};

export default Terminal;
