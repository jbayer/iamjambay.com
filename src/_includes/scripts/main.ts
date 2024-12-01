import {fetchLatestOriginalPosts} from './bsky-client.js'; // Adjust the import path as needed
import {getPostUrl} from "./bsky-client.js";

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}


/**
 * Renders the latest original posts into an HTML container on the page.
 */
async function main(containerId: string, username: string, postLimit: number = 10) {
    // Get the container element where posts will be rendered
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Display a loading message while fetching posts
    container.innerHTML = `
        <div class="relative flex items-center mb-9">
            <!-- Dot -->
            <div class="relative z-10 w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 ml-0"></div>
          
            <div class="ml-8 flex-1 text-gray-700 mt-2 pb-4">
                Loading posts...
            </div>
        </div>`


    try {
        // Fetch the latest original posts
        const posts = await fetchLatestOriginalPosts(username, postLimit);
        // Render posts into the container
        if (posts.length === 0) {
            container.innerHTML = '<p>No posts found.</p>';
        } else {
            container.innerHTML = posts
                .map(post =>
                    `<div class="relative flex items-center mb-9">
                        <!-- Dot -->
                        <div class="relative z-10 w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 ml-0"></div>
                        <!-- Post Content -->
                         <div class="ml-8 flex-1 border-b border-gray-200 pb-4">
                             <p class="text-xs text-gray-500">${formatDate(post.record.createdAt)}</p>
                             <p class="text-gray-700 mt-2">
                              ${post.record.text}
                             </p>
                            <div class="mt-3 text-sm text-gray-500 flex space-x-4">
                               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> ${post.likeCount} 
                               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg> ${post.replyCount} 
                               <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg> ${post.repostCount}
                               <a href="${getPostUrl(post)}" target="_blank" class="relative flex item-center text-blue-500 text-sm hover:underline">View Post</a>
                            </div>
                        </div>
                    </div>`
                )
                .join('');
        }
    } catch (error) {
        console.error('Error fetching or rendering posts:', error);
        container.innerHTML = `
            <div class="relative flex items-center mb-9">
            <!-- Dot -->
            <div class="relative z-10 w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 ml-0"></div>
          
            <div class="ml-8 flex-1 pb-4 text-gray-700 mt-2">
                Error loading posts, please try again later..
            </div>
        </div>`
    }
}

// Hook the function to run after the page loads
window.addEventListener("DOMContentLoaded", () => {
    main('posts-content', 'apurvamehta.com');
});
