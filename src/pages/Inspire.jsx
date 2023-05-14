import React from 'react'
// import LoginButton from "../components/LoginButton";
// import LogoutButton from "../components/LogoutButton";
// import {uploadJson} from "./upload";
import {
    AudioType,
    ContentFocus,
    useActiveProfile,
    useCreatePost,
} from '@lens-protocol/react-web'

async function upload(content) {
    const url = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
    }).then((response) => response.json().then((data) => data))

    console.log('http://harmonylens.infura-ipfs.io/ipfs/' + url.uri)

    return 'http://harmonylens.infura-ipfs.io/ipfs/' + url.uri
}

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
    const { execute: create } = useCreatePost({ publisher, upload })
    const onSubmit = async () => {
        await create({
            contentFocus: ContentFocus.AUDIO,
            media: [
                {
                    url: 'https://bafybeiga5doszfextckersvxnj5rcytx3y4uzktulft5glatydiky4k2l4.ipfs.w3s.link/audio-7.mp3',
                    mimeType: AudioType.MP3,
                    cover: 'https://cryptoslate.com/wp-content/uploads/2022/08/lens-protocol-cover.jpg',
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
