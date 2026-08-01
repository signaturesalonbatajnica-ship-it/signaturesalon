import { useState, useEffect } from 'react';

export function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Something happened');

    return () => {
      console.log('Cleanup happened');
    };
  }, []);

  useEffect(() => {
    console.log('wtf...');
  }, []);

  return (
    <>
      <title>Home</title>
      <meta name="description" content="Welcome to the home page" />
      <main>
        <h1>Home</h1>
        <button onClick={() => setCount((c) => c + 1)}>clicks: {count}</button>
        <p>Hello world</p>
        <a href="/about/">about</a>
      </main>
    </>
  );
}
