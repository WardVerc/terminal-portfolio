import { ReactNode } from "react";
import { asciiSurfer } from "../assets/ascii";
import { ProjectInterface } from "../App";

interface Command {
  name: string;
  description: string;
}

interface CommandRendererProps {
  commands: string[];
  preCommand: ReactNode;
  clear: () => void;
  projects: ProjectInterface[];
}

const commandList: Command[] = [
  { name: "overview", description: "View all projects" },
  { name: "help", description: "Show a list of available commands" },
  { name: "clear", description: "Clear the terminal and your mind" },
  { name: "surfer", description: "Show the ascii art surfer" },
];

const CommandRenderer: React.FC<CommandRendererProps> = ({
  commands,
  preCommand,
  clear,
  projects,
}) => {
  // Add project id's as commands
  projects.forEach((project) => {
    const command = {
      name: project.id,
      description: `View ${project.id} in detail`,
    };
    // only if commandlist does not already contain the command
    if (
      !commandList.some((commandOfList) => commandOfList.name === command.name)
    ) {
      commandList.push(command);
    }
  });

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

  const showDescription = (description: string) => (
    <div className="m-8">
      <p>{description}</p>
    </div>
  );

  return (
    <>
      {commands.map((command: string) => {
        const project = projects.find(
          (project) => command.toLowerCase() == project.id,
        );

        if (command.toLowerCase() == "clear") {
          clear();
          return;
        } else if (command.toLowerCase() == "help") {
          return (
            <>
              {renderDefault(command)}
              {renderHelp()}
            </>
          );
        } else if (command.toLowerCase() == "surfer") {
          return (
            <>
              {renderDefault(command)}
              {showSurfer()}
            </>
          );
        } else if (command.toLowerCase() == "overview") {
          return (
            <>
              {renderDefault(command)}
              {showProject("overview")}
            </>
          );
        } else if (project) {
          return (
            <>
              {renderDefault(command)}
              {showProject(project.id)}
              {showDescription(project.description)}
            </>
          );
        } else {
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
