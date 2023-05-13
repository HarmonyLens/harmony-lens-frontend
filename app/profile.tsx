import { useProfilesOwnedByMe } from '@lens-protocol/react-web';

function MyProfiles() {
  const { data: profiles, error, loading } = useProfilesOwnedByMe();

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
     {profiles.map((profile) => (
       <li key={profile.id}>{profile.name}</li>
     ))}
    </ul>
  );
}