import React, { useState } from 'react'
// import LoginButton from "../components/LoginButton";
// import LogoutButton from "../components/LogoutButton";
// import {uploadJson} from "./upload";
import {
    AudioType,
    ContentFocus,
    useActiveProfile,
    useCreatePost,
} from '@lens-protocol/react-web'

import { uploadJson } from './upload'

async function upload(content) {
    const data = await uploadJson(content)
    return data
}

// async function upload(content) {
//     console.log('content', content)

//     const url = await fetch('http://localhost:3000/upload', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(content),
//     }).then((response) => response.json().then((data) => data))

//     console.log('ipfs://' + url.uri)

//     return 'ipfs://' + url.uri
// }

const Home = () => {
    const { data: publisher, loading } = useActiveProfile()

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex flex-col relative">
            <div className="relative flex justify-between h-[33vh] w-full bg-main p-4 mb-10">
                <Compose publisher={publisher} />
            </div>
        </div>
    )
}

function Compose({ publisher }) {
    const {
        execute: create,
        error,
        isPending,
    } = useCreatePost({ publisher, upload })

    const onSubmit = async () => {
        console.log('onSubmit')
        await create({
            content: 'ipfs://Qmehd6BMxWCCWF8w7gGJ17kDKnxryUanybdGzSgCFGCnfP',
            contentFocus: ContentFocus.AUDIO,
            locale: 'en',
            name: 'test',
            description: 'test',
            media: [
                {
                    url: 'ipfs://Qmehd6BMxWCCWF8w7gGJ17kDKnxryUanybdGzSgCFGCnfP',
                    mimeType: AudioType.MP3,
                    cover: 'ipfs://QmdTXL4siQ4MXb5QgFr4dV27skPaeDKRkrh2Xd4MZvitoZ',
                },
            ],
            attributes: [
                {
                    displayType: 'DATE',
                    value: new Date(), // actual Data instance
                    traitType: 'DoB',
                },
                {
                    displayType: 'NUMBER',
                    value: 42, // an actual JS number
                    traitType: 'Level',
                },
                {
                    displayType: 'STRING',
                    value: '#ababab', // an arbitrary JS string
                    traitType: 'Color',
                },
            ],
        })
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onSubmit}
            >
                Inspire Me
            </button>
        </div>
    )
}

export default Home
