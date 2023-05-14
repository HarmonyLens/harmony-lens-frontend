import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './output.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { appId, LensProvider, production } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'

import App from './App.jsx'
import Song from './pages/Song.jsx'
import Navbar from './components/Navbar.jsx'
import Inspire from './pages/Inspire'
import Songs from './pages/Songs.jsx'
const { provider, webSocketProvider } = configureChains(
    [polygon, polygonMumbai],
    [publicProvider()]
)

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
})

const lensConfig = {
    // appId: appId('harmony'),
    // sources: [appId('harmony')],
    bindings: wagmiBindings(),
    environment: production,
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <WagmiConfig client={client}>
        <LensProvider config={lensConfig}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route index element={<App />} />
                    <Route path="/song/:id" element={<Song />} />
                    <Route path="/inspire" element={<Inspire />} />
                    <Route path="/songs" element={<Songs />} />
                </Routes>
            </BrowserRouter>
        </LensProvider>
    </WagmiConfig>
)
