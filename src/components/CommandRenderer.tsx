import { ReactNode } from "react";
import { asciiSurfer, asciiTitle } from "../assets/ascii";

interface Command {
  name: string;
  description: string;
}

interface CommandRendererProps {
  commands: string[];
  preCommand: ReactNode;
  clear: () => void;
}

const commandList: Command[] = [
  { name: "help", description: "Show a list of available commands" },
  { name: "clear", description: "Clear the terminal and your mind" },
  { name: "title", description: "Show the ascii art title" },
  { name: "surfer", description: "Show the ascii art surfer" },
  { name: "projects", description: "View all projects" },
  { name: "overview", description: "View all projects" },
  { name: "project1", description: "View project1 in detail" },
  { name: "project2", description: "View project2 in detail" },
];

const CommandRenderer: React.FC<CommandRendererProps> = ({
  commands,
  preCommand,
  clear,
}) => {
  const renderDefault = (command: string) => (
    <p className="flex">
      {preCommand}
      {command}
    </p>
  );

  const renderCommandNotFound = () => (
    <p>
      Command not found. For a list of commands, type{" "}
      <span className="text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
        'help'
      </span>
      .
    </p>
  );

  const renderHelp = () => (
    <div className="m-8">
      {commandList.map((command: Command) => (
        <div className="flex">
          <span className="w-36 text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
            {command.name}
          </span>
          <span>{command.description}</span>
        </div>
      ))}
    </div>
  );

  const showTitle = () => (
    <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
      <pre>{asciiTitle}</pre>
    </span>
  );

  const showSurfer = () => (
    <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
      <pre>{asciiSurfer}</pre>
    </span>
  );

  const showProject = (projectName: string) => (
    <>
      <p>Showing {projectName}...</p>
    </>
  );

  return (
    <>
      {commands.map((command: string) => {
        switch (command.toLowerCase()) {
          case "clear":
            clear();
            break;
          case "help":
            return (
              <>
                {renderDefault(command)}
                {renderHelp()}
              </>
            );
          case "title":
            return (
              <>
                {renderDefault(command)}
                {showTitle()}
              </>
            );
          case "surfer":
            return (
              <>
                {renderDefault(command)}
                {showSurfer()}
              </>
            );
          case "projects":
            return (
              <>
                {renderDefault(command)}
                {showProject("projects")}
              </>
            );
          case "overview":
            return (
              <>
                {renderDefault(command)}
                {showProject("overview")}
              </>
            );
          case "project1":
            return (
              <>
                {renderDefault(command)}
                {showProject("project1")}
              </>
            );
          case "project2":
            return (
              <>
                {renderDefault(command)}
                {showProject("project2")}
              </>
            );
          default:
            return (
              <>
                {renderDefault(command)}
                {renderCommandNotFound()}
              </>
            );
        }
      })}
    </>
  );
};

export default CommandRenderer;
