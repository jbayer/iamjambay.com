import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({
    "dist/styles": "styles",
    "dist/scripts": "scripts"
  });

  eleventyConfig.setServerOptions({
    watch: ['./src/_includes/scripts/**/*.ts'], // Watch TypeScript files
  });


  // Watch TypeScript and CSS files and trigger rebuilds
  eleventyConfig.setBrowserSyncConfig({
    files: ["./dist/scripts/**/*.js", "./dist/styles/**/*.css"],
  });

  eleventyConfig.addShortcode('viteScripts', () => {
    const manifestPath = path.resolve(__dirname, 'dist/scripts/.vite/manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const mainJs = manifest['src/_includes/scripts/main.ts']?.file;
      if (mainJs) {
        return `<script type="module" src="/scripts/${mainJs}"></script>`;
      }
    }
    return ''; // Fallback if manifest doesn't exist
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
      output: "_site",
    },

  };
};
