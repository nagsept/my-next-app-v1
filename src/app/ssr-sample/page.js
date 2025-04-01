import React from 'react';

// Directly fetch data in the component
const SSRSample = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post = await res.json();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Server-Side Rendered Page</h1>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
};

export default SSRSample;
