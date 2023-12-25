import { asciiSurfer, asciiTitle } from "../assets/ascii";

const Banner: React.FC = () => {
  return (
    <div className="font-mono absolute w-full">
      <p className="text-sm text-cyan-100 drop-shadow-[0_0_2px_rgb(34,211,238)]">
        © WardVerc's not a corporation. All rights resurfed.
      </p>
      <div className="flex justify-center">
        <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
          <pre>{asciiTitle}</pre>
        </span>
        <span className="text-xs text-cyan-400 drop-shadow-[0_0_5px_rgb(34,211,238)]">
          <pre>{asciiSurfer}</pre>
        </span>
      </div>
    </div>
  );
};

export default Banner;
