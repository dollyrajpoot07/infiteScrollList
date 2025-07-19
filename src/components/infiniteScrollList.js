'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './infiniteScrollList.module.css';

const InfiniteScrollList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef();

    const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`);
        const data = await res.json();
        if (data.length === 0) setHasMore(false);
        setPosts((prev) => [...prev, ...data]);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => loaderRef.current && observer.unobserve(loaderRef.current);
    }, [loading, hasMore]);

    return (
        <div className={styles.listContainer}>
            {posts.map((post) => (
                <div key={post.id} className={styles.postCard}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
            {loading && <p className={styles.loading}>Loading...</p>}
            {!hasMore && <p className={styles.endMsg}>No more posts to show.</p>}
            <div ref={loaderRef}></div>
        </div>
    );
};

export default InfiniteScrollList;
