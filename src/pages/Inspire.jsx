import {
  ContentFocus,
  useCreatePost,
  CollectPolicyType,
} from "@lens-protocol/react-web";

export default function Inspire() {
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({ publisher, upload: uploadJson });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    return json.url;
  };

  const inspire = async () => {
    // const path = "https://www.youtube.com/watch?v=gGdGFtwCNBE";
    const songUrl = await uploadFile(songFile);

    await create({
      contentFocus: ContentFocus.AUDIO,
      locale: "en",
      content: `
          # Lyrics
          `,
      media: [
        {
          songUrl,
          mimeType: AudioType.MP3,
          altTag: "Mr. Brightside - The Killers (cover by Ronnie)",
        },
      ],
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={inspire}
      >
        Inspire Me
      </button>
    </div>
  );
}
