import { useEffect, useState } from "react";
import CommandRenderer from "./CommandRenderer.tsx";
import { ProjectInterface } from "../App.tsx";

interface TerminalProps {
  setCloseUpProject: (project: string) => void;
  projects: ProjectInterface[];
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
  projects,
}: TerminalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [commands, setCommands] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommands([...commands, inputValue]);

    if (inputValue == "overview" || inputValue == "clear") {
      setCloseUpProject("overview");
    } else {
      projects.forEach((project) => {
        if (inputValue == project.id) {
          setCloseUpProject(project.id);
        }
      });
    }
    setInputValue("");
  };

  useEffect(() => {
    const terminalInputElement = document.getElementById("terminalInput");
    terminalInputElement &&
      terminalInputElement.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [commands]);

  const focusOnTerminal = () => {
    const terminalInputElement = document.getElementById("terminalInput");
    terminalInputElement && terminalInputElement.focus();
  };

  return (
    <div
      onClick={() => focusOnTerminal()}
      className="absolute mt-36 ml-4 p-2 font-mono min-w-[550px] w-1/3 h-5/6 bg-[var(--main-bg-color)] overflow-hidden rounded-md"
    >
      <p>Use the mouse to look around and zoom.</p>
      <p className="mb-8">Type 'help' for a list of available commands.</p>
      <div>
        <CommandRenderer
          preCommand={preCommand}
          commands={commands}
          clear={() => setCommands([])}
          projects={projects}
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
