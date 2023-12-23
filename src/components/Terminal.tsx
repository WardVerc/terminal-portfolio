import { useState } from "react";
import { asciiSurfer, asciiTitle } from "../assets/ascii.js";

interface Command {
  name: string;
  description: string;
}

const commandList: Command[] = [
  { name: "help", description: "Show a list of available commands" },
  { name: "clear", description: "Clear the terminal and your mind" },
];

const preCommand = "visitor@terminal-portfolio:~$ ";

const Terminal: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [commands, setCommands] = useState<string[]>([]);

  const renderDefault = (command: string) => (
    <p>
      {preCommand}
      {command}
    </p>
  );

  const renderHelp = () => (
    <div>
      {commandList.map((command: Command) => (
        <>
          <span>{command.name}</span>
          <span>{command.description}</span>
        </>
      ))}
    </div>
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommands([...commands, inputValue]);
    setInputValue("");
  };

  return (
    <div className="font-mono">
      <p className="text-sm">
        © WardVerc's not a corporation. All rights resurfed.
      </p>
      <div className="flex">
        <span className="text-xs">
          <pre>{asciiTitle}</pre>
        </span>
        <span className="text-xs">
          <pre>{asciiSurfer}</pre>
        </span>
      </div>
      <p>Type 'help' for a list of available commands.</p>
      <div>
        {commands.map((command: string) => {
          switch (command.toLowerCase()) {
            case "clear":
              setCommands([]);
              break;
            case "help":
              return (
                <>
                  {renderDefault(command)}
                  {renderHelp()}
                </>
              );
            default:
              return renderDefault(command);
          }
        })}
      </div>
      <form onSubmit={onSubmit}>
        <p>
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
