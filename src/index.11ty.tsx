import React from "react";
import {fetchLatestOriginalPosts} from "./_includes/js/bsky-client";



export default async function render(){
    const posts = await fetchLatestOriginalPosts("apurvamehta.com");

    return (
        <div className="container mx-auto">
            <h1 className="font-bold text-xl my-4">Latest posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.uri}>{post.record.text}</li>
                ))}
            </ul>
        </div>
    );
}
