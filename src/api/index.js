const mockData = {
  data: {
    posts: [
      {
        id: "100062180",
        pubId: "180",
        profileId: {
          id: "100062",
          handle: "tosif53868797.lens",
        },
        contentURI:
          "https://harmonylens.infura-ipfs.io/ipfs/bafybeigb2r24afrsyedawslj4kvny7gzd5jihqxy4rfampvmigvagdj2hu/",
        timestamp: "1677040087",
      },
      {
        id: "100299101",
        pubId: "101",
        profileId: {
          id: "100299",
          handle: "sawawa.lens",
        },
        contentURI:
          "https://harmonylens.infura-ipfs.io/ipfs/bafybeigb2r24afrsyedawslj4kvny7gzd5jihqxy4rfampvmigvagdj2hu/",
        timestamp: "1680290331",
      },
      {
        id: "10069332",
        pubId: "32",
        profileId: {
          id: "100693",
          handle: "crazydrops.lens",
        },
        contentURI:
          "https://harmonylens.infura-ipfs.io/ipfs/bafybeigb2r24afrsyedawslj4kvny7gzd5jihqxy4rfampvmigvagdj2hu/",
        timestamp: "1673841113",
      },
      {
        id: "100842693",
        pubId: "693",
        profileId: {
          id: "100842",
          handle: "kaushik_chitesh.lens",
        },
        contentURI:
          "https://harmonylens.infura-ipfs.io/ipfs/bafybeigb2r24afrsyedawslj4kvny7gzd5jihqxy4rfampvmigvagdj2hu/",
        timestamp: "1682558493",
      },
      {
        id: "100998274",
        pubId: "274",
        profileId: {
          id: "100998",
          handle: "junaid27831453.lens",
        },
        contentURI:
          "https://harmonylens.infura-ipfs.io/ipfs/bafybeigb2r24afrsyedawslj4kvny7gzd5jihqxy4rfampvmigvagdj2hu/",
        timestamp: "1674969810",
      },
    ],
  },
};

export const fetchPosts = () => {
  return new Promise(async (resolve, reject) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return resolve(mockData);
  });
};

export const fetchPostDetails = async (post) => {
  const metadata = await fetch(`${post.contentURI}/metadata.json`).then(
    (res) => {
      return res.json();
    }
  );
  // const midi = await fetch(`${post.contentURI}/audio.mid`).then((res) => {
  //   return res.arrayBuffer();
  // });

  post.metadata = metadata;
  post.midi = `${post.contentURI}/audio.mid`;

  return post;
};

export const fetchPostById = async (id) => {
  const post = mockData.data.posts.find((post) => post.id === id);
  return await fetchPostDetails(post);
};

export const fetchPostsByProfileId = async (profileId) => {
  const posts = mockData.data.posts.filter(
    (post) => post.profileId.id === profileId
  );

  return await Promise.all(posts.map((post) => fetchPostDetails(post)));
};
