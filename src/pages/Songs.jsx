import {
  useExplorePublications,
  PublicationMainFocus,
} from "@lens-protocol/react-web";

export default function Songs() {
  const {
    data: publication,
    loading,
    hasMore,
    next,
  } = useExplorePublications({
    limit: 10,
    metadataFilter: {
      restrictPublicationMainFocusTo: ["AUDIO"],
    },
  });

  console.log(publication);

  return (
    <div className="flex flex-col justify-center items-center">
      {loading || publication === undefined ? (
        <div>Loading...</div>
      ) : (
        <div>
          {publication.map((publication) => (
            <div key={publication.id}>
              <h1>A</h1>
              <div>{publication?.metadata?.content}</div>
              <img
                src={publication?.metadata?.media[0]?.original?.cover}
                width={100}
              />
              {/* <div>{publication.media[0].songUrl}</div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
