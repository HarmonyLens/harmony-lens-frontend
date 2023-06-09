import ConnectionButton from "./LoginButton";
import reactLogo from "../assets/react.svg";
import { useActiveProfile } from "@lens-protocol/react-web";

const User = ({ image }) => {
  return (
    <div>
      <img src={image} />
    </div>
  );
};

const Profile = () => {
  const { data, error, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (data === null) return <p>No active profile</p>;

  return (
    <div>
      <p>Active profile: {data.handle}</p>
    </div>
  );
};

export default function Navbar() {
  return (
    <div className="flex flex-row text-white justify-between w-full py-2 items-center">
      <Profile />
      <div className="flex flex-row space-x-4">
        <ConnectionButton />
        <User image={reactLogo} />
      </div>
    </div>
  );
}
