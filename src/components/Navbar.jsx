import ConnectionButton from "./LoginButton";
import reactLogo from "../assets/react.svg";

const User = ({ image }) => {
  return (
    <div>
      <img src={image} />
    </div>
  );
};

export default function Navbar() {
  return (
    <div className="flex flex-row text-white justify-between w-full">
      <div className="text-white">
        <h1>Welcome</h1>
        <h1>Dave!</h1>
      </div>
      {/* <span id="lens-follow-small" data-handle="yourhandle" /> */}
      <ConnectionButton />
      <User image={reactLogo} />
    </div>
  );
}
