import { asciiSurfer, asciiTitle } from "../assets/ascii.js";
import "./Terminal.css";

const Terminal: React.FC = () => {
  return (
    <div className="terminalContainer">
      <pre>{asciiTitle}</pre>
      <pre>{asciiSurfer}</pre>
    </div>
  );
};

export default Terminal;
