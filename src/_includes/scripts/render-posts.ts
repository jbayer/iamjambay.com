import {fetchLatestOriginalPosts} from './bsky-client.js'; // Adjust the import path as needed

/**
 * Renders the latest original posts into an HTML container on the page.
 */
async function renderPosts(containerId: string, username: string, postLimit: number = 10) {
    // Get the container element where posts will be rendered
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Display a loading message while fetching posts
    container.innerHTML = '<p>Loading posts...</p>';

    try {
        // Fetch the latest original posts
        const posts = await fetchLatestOriginalPosts(username, postLimit);
        console.log("hi");
        // Render posts into the container
        if (posts.length === 0) {
            container.innerHTML = '<p>No posts found.</p>';
        } else {
            container.innerHTML = posts
                .map(post => `<li key=${post.uri}>${post.record.text}</li>`)
                .join('');
        }
    } catch (error) {
        console.error('Error fetching or rendering posts:', error);
        container.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

// Hook the function to run after the page loads
window.addEventListener('load', () => {
    console.log("hello, world");
    renderPosts('posts-container', 'apurvamehta.com');
});
