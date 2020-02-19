import { useEffect, useState } from 'react'
import { getPosts } from "./apiPost";

// This fxn gets more posts whenever the page number changes
export default function useFetchMorePosts(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPosts(pageNumber).then(data => {
      setPosts(prevPosts => [...prevPosts, ...data]);
      setHasMore(data.length > 0);
      setLoading(false);
    }).catch(e => {
      setError(true);
    });
  }, [pageNumber])

  return { loading, error, posts, hasMore }
}