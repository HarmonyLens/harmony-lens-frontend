import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    useExplorePublications,
    useActiveProfile,
} from '@lens-protocol/react-web'
import { Audio } from 'react-loader-spinner'

function LatestSongs() {
    const {
        data: publication,
        loading,
        hasMore,
        next,
    } = useExplorePublications({
        limit: 12,
        publicationTypes: ['POST'],
        sortCriteria: 'LATEST',

        metadataFilter: {
            restrictPublicationMainFocusTo: ['AUDIO'],
            // restrictPublicationLocaleTo: ['en'],
        },
    })

    const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now())

    if (loading) {
        return (
            <Audio
                height="80"
                width="80"
                radius="9"
                color="purple"
                ariaLabel="three-dots-loading"
                wrapperStyle
                wrapperClass
            />
        )
    }

    const ipfsUrl = (url) => {
        if (!url) return
        if (url.includes('ipfs://')) {
            const newUrl =
                'http://harmonylens.infura-ipfs.io/ipfs/' +
                url.split('ipfs://')[1]
            return newUrl
        } else {
            return url
        }
    }

    return (
        <div className="flex flex-col justify-between items-center text-white space-y-2">
            <h1> Latest Songs </h1>
            <div>
                {/* // className="overflow-auto max-h-[50vh]"> */}

                <div className="grid grid-cols-1 justify-between gap-10 items-center max-w-[100vw]  px-10 py-10 ">
                    {publication.map((publication, index) => (
                        <div
                            key={index}
                            className="flex justify-center items-center"
                        >
                            <Link
                                to={`/song/${publication.id}`}
                                className="cursor-pointer flex flex-col items-center text-center"
                            >
                                <img
                                    src={
                                        ipfsUrl(
                                            publication?.metadata?.media[0]
                                                ?.original?.cover
                                        ) ||
                                        ipfsUrl(publication?.metadata?.image)
                                    }
                                    width={300}
                                />
                                <div>
                                    {publication?.metadata?.content.substring(
                                        0,
                                        100
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => {
                        next()
                        setLastUpdatedAt(Date.now() + 3000)
                    }}
                    className="flex text-right justify-end items-end mr-20 ml-auto"
                >
                    Load More
                </button>
            </div>
        </div>
    )
}

function InspireStates() {
    const [visible, setVisible] = useState(false)
    const [sentiment, setSentiment] = useState({
        DocSentimentResultString: 'X',
        DocSentimentValue: 0,
    })
    const [notes, setNotes] = useState({
        sectionAmount: 0,
        noteAmount: 0,
    })
    const { data: publisher, loading } = useActiveProfile()

    const [uri, setUri] = useState('')

    const inspireHandler = async () => {
        setVisible(true)
        const sentiment = await fetch(
            'http://localhost:3000/emotionOfHandle?handle=' + publisher.handle
        ).then((response) => response.json().then((data) => data))

        setSentiment({
            DocSentimentResultString: sentiment.DocSentimentResultString,
            DocSentimentValue: sentiment.DocSentimentValue,
        })

        const notes = await fetch(
            `http://localhost:3000/notes?mood="${sentiment.DocSentimentResultString}"`
        ).then((response) => response.json().then((data) => data))

        setNotes({
            sectionAmount: notes.sections.length,
            noteAmount: notes.sections
                .map((section) => section.notes.length)
                .reduce((a, b) => a + b, 0),
        })

        const uri = await fetch('http://localhost:3000/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notes),
        }).then((response) => response.json().then((data) => data.uri))

        setUri(uri)
    }

    return (
        <div className="flex flex-col justify-between items-center text-white space-y-2">
            {visible && (
                <div className="absolute flex flex-col  top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-80 flex justify-center items-center">
                    <button onClick={() => setVisible(false)}>Close</button>

                    <div className="flex flex-col justify-between items-center text-white space-y-2 text-center">
                        {sentiment.DocSentimentResultString !== 'X' && (
                            <div className="flex justify-center items-center bg-purple-600 px-4 py-10 w-[50vw] ">
                                <h1 className="">
                                    Your last 5 tweets' sentiment is
                                    {sentiment.DocSentimentResultString} with
                                    {sentiment.DocSentimentValue} value
                                </h1>
                            </div>
                        )}
                        {notes.sectionAmount !== 0 && (
                            <div className="flex justify-center items-center bg-purple-600 px-4 py-10 w-[50vw] ">
                                <h1 className="">
                                    Notes are created. There are{' '}
                                    {notes.sectionAmount} sections and
                                    {notes.noteAmount} notes in total.
                                </h1>
                            </div>
                        )}
                        {uri !== '' && (
                            <div className="flex justify-center items-center bg-purple-600 px-4 py-10 w-[50vw]  space-x-2">
                                <h1 className="">
                                    Your song is created. Here is the FileCoin
                                    link
                                </h1>
                                <a
                                    href={`http://harmonylens.infura-ipfs.io/ipfs/${uri}`}
                                    target="_blank"
                                    className="underline"
                                >
                                    here
                                </a>
                            </div>
                        )}
                        {uri !== '' && (
                            <div className="flex justify-center items-center bg-purple-600 px-4 py-10 w-[50vw]  space-x-2">
                                <h1 className="">
                                    Post your song to Harmony Lens
                                </h1>
                                <button
                                    onClick={() => {
                                        console.log('clicked')
                                    }}
                                    className="underline"
                                >
                                    Post It
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button
                onClick={inspireHandler}
                className="flex text-right justify-end items-end mr-20 ml-auto bg-white text-black px-4 py-2 rounded-md hover:scale-105 transition duration-300 ease-in-out transform left-1/2 absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
            >
                Inspire Me
            </button>
        </div>
    )
}

function App() {
    return (
        <div className="flex flex-col justify-between items-center">
            <div className="relative flex justify-between h-[33vh] w-full bg-main p-4 mb-10">
                <InspireStates />
            </div>
            <LatestSongs />
        </div>
    )
}

export default App
