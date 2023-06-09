import {
  useWalletLogin,
  useActiveWallet,
  useWalletLogout,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function LoginButton() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div>
      {loginError && <p>{loginError}</p>}
      <button disabled={isLoginPending} onClick={onLoginClick}>
        Log in
      </button>
    </div>
  );
}

function LogoutButton() {
  const { execute: logout, isPending } = useWalletLogout();

  return (
    <button disabled={isPending} onClick={logout}>
      Log out
    </button>
  );
}

export default function ConnectionButton() {
  const { data: wallet, loading } = useActiveWallet();

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="connection-container">
      {wallet ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
