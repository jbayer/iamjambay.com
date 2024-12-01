import { AtpAgent } from "@atproto/api";
import {PostView} from "@atproto/api/dist/client/types/app/bsky/feed/defs.js";


export function getPostUrl(post: PostView): string {
    const uriParts = post.uri.split("/");
    const postId = uriParts[uriParts.length - 1]; // Get the last part of the URI
    const profileHandle = post.author.handle; // Get the author's handle
    return `https://bsky.app/profile/${profileHandle}/post/${postId}`;
}

export async function fetchLatestOriginalPosts(username: string, desiredCount = 10) {
    const atProtoAgent = new AtpAgent({
        // App View URL
        service: "https://api.bsky.app"
    });

    let originalPosts = []; // Accumulate results here
    let cursor: string | undefined; // Pagination cursor
    let hasMore = true; // Flag to continue fetching

    try {
        while (hasMore && originalPosts.length < desiredCount) {
            // Fetch the user's feed with the cursor if available
            const response = await atProtoAgent.app.bsky.feed.getAuthorFeed({
                actor: username, // Bluesky handle, e.g., 'example.bsky.social'
                limit: 50,       // Fetch more posts to filter later
                cursor,          // Pagination cursor for subsequent pages
            });

            // Filter only original posts (exclude replies and reposts)
            const newOriginalPosts = response.data.feed
                .filter(item => {
                    const post = item.post.record;
                    // @ts-ignore
                    return !post.reply && !item.reason // Exclude replies and reposts
                })
                .map(item => item.post)

            // Add filtered posts to the accumulated results
            originalPosts = [...originalPosts, ...newOriginalPosts];

            // Update the cursor for the next page
            cursor = response.data.cursor;

            // Stop if there are no more pages
            hasMore = !!cursor;
        }

        // Return only the desired number of posts
        return originalPosts.slice(0, desiredCount);
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}
