import { useEffect, useState } from "react";
import CommandRenderer from "./CommandRenderer.tsx";

interface TerminalProps {
  setCloseUpProject: (project: string) => void;
}

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

const Terminal: React.FC<TerminalProps> = ({
  setCloseUpProject,
}: TerminalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [commands, setCommands] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommands([...commands, inputValue]);
    switch (inputValue) {
      case "overview":
        setCloseUpProject("overview");
        break;
      case "clear":
        setCloseUpProject("overview");
        break;
      case "project1":
        setCloseUpProject("project1");
        break;
      case "project2":
        setCloseUpProject("project2");
        break;
    }
    setInputValue("");
  };

  useEffect(() => {
    const terminalInputElement = document.getElementById("terminalInput");
    terminalInputElement &&
      terminalInputElement.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [commands]);

  return (
    <div className="absolute mt-36 ml-4 p-2 font-mono min-w-[550px] w-1/3 h-5/6 bg-[var(--main-bg-color)] overflow-hidden rounded-md">
      <p>Use the mouse to look around and zoom.</p>
      <p className="mb-8">Type 'help' for a list of available commands.</p>
      <div>
        <CommandRenderer
          preCommand={preCommand}
          commands={commands}
          clear={() => setCommands([])}
        />
      </div>
      <form onSubmit={onSubmit} autoComplete="off">
        <p className="flex">
          {preCommand}
          <input
            id="terminalInput"
            type="text"
            className="outline-none bg-transparent"
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
