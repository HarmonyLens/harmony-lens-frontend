import { useState } from 'react';
import { ContentFocus, ProfileOwnedByMe, useCreatePost } from '@lens-protocol/react-web';
import { uploadJson } from './upload'

interface ComposerProps {
  publisher: ProfileOwnedByMe;
}

export default function Composer({ publisher }: ComposerProps) {
  const [content, setContent] = useState('');
  const { execute: create, error, isPending } = useCreatePost({ publisher, upload: uploadJson });

  const onSubmit = async (content: string) => {
    await create({
      content,
      contentFocus: ContentFocus.TEXT,
      locale: 'en'
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(content);
  };

  return (
    <div className="composer">
      <h2>Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
            rows={4}
            cols={50}
          />
        </div>
        {/* <div>
        <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="type"
            rows={4}
            cols={50}
          />
        </div> */}
        <div>
          <button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Post'}
          </button>
        </div>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}