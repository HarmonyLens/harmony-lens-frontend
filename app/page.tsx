// app/page.tsx
'use client'
import Image from 'next/image'
import { ProfileId, useExploreProfiles } from '@lens-protocol/react-web'
import Link from 'next/link'
import { formatPicture } from '../utils'
import ConnectionButton from './connectionbutton';
import Composer from './composer';
import { useActiveProfile, usePublications } from '@lens-protocol/react-web';
import { WhenLoggedInWithProfile } from './WhenLoggedInWithProfile';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';


function MyProfile() {
  const { data, error, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (data === null) return <p>No active profile</p>;

  return (
    <div>
      <p>Active profile: {data.handle}</p>
    </div>
  );
}

function Publications() {
  const {
      data: publications} = usePublications({
      profileId: '0x806e' as ProfileId,
      limit: 10,
    });
    if (publications === null) return <p>No publications</p>;
    return (    <>
      {
        publications?.map((pub: any) => (
          <div className="py-4 bg-zinc-900 rounded mb-3 px-4">
            <p>{pub.metadata.content}</p>
          </div>
        ))
    }
    </>)
  }

export default function Home() {
  const { data } = useExploreProfiles({
    limit: 25
  })

  console.log('data:', data)

  return (
    <div className='p-20'>
      <h1 className='text-5xl'>Exploring</h1>
      <ConnectionButton />
      {
        data?.map((profile, index) => (
          <Link href={`/profile/${profile.handle}`} key={index}>
            <div className='my-14'>
              {
                profile.picture && profile.picture.__typename === 'MediaSet' ? (
                  <img
                    src={formatPicture(profile.picture)}
                    width="120"
                    height="120"
                    alt={profile.handle}
                  /> 
                ) : <div className="w-14 h-14 bg-slate-500	" />
              }
              <h3 className="text-3xl my-4">{profile.handle}</h3>
              <p className="text-xl">{profile.bio}</p>
            </div>
          </Link>
        ))
      }
      <MyProfile />
      <WhenLoggedInWithProfile>
          {({ profile }) => (
            <>
              <Composer publisher={profile} />
              </>
          )}
        </WhenLoggedInWithProfile>

        <h1 className='text-5xl'>Exploring</h1>
        <Publications />

    </div>
  )
}
