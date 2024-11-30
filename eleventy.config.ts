import "tsx/esm";
import { renderToStaticMarkup } from "react-dom/server";


export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "global.out.css": "styles/global.css"

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
