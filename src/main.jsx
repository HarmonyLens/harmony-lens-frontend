import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Song from "./pages/Song.jsx";
import "./output.css";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { LensProvider, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
const { provider, webSocketProvider } = configureChains(
  [polygon, mainnet, polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const lensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig client={client}>
    <LensProvider config={lensConfig}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}
          <Route index element={<App />} />
          <Route path="/song/:id" element={<Song />} />
          {/* <Route path="*" element={<NoPage />} /> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </LensProvider>
  </WagmiConfig>
);
