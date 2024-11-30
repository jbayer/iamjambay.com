import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    build: {
      manifest: true,
      rollupOptions: {
        input: 'src/_includes/scripts/render-posts.ts'
      },
    },
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
      },
      proxy: {
        // Proxy 11ty's output to serve with Vite
        '/': 'http://localhost:8080',
      },
    },
  });

  eleventyConfig.addPassthroughCopy({
    "dist/styles": "styles",
    "dist/scripts": "scripts"
  });

  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
    compile: function () {
      return async function (data) {
        let content = await this.defaultRenderer(data);
        return renderToStaticMarkup(content);
      };
    },
  });


  eleventyConfig.addTemplateFormats(["11ty.tsx, 11ty.jsx, 11ty.ts"])

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },

  };
};
