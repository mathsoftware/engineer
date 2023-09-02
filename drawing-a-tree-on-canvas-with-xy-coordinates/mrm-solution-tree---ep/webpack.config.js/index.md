---
permalink: drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack.config.js.html
title: "drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack.config.js"
---

# webpack.config.js
```javascript
module.exports = env => {
  let mode = 'prod';
  if (env['dev']) {
    mode = 'dev';
  }
  else if (!env['prod']) {
    const msg = `
      Invalid build argument env: ${ env }, use 'dev' or 'prod' only.\n
      Using 'prod' production mode by default.
    `;
    console.log(msg);
  }
  return require(`./webpack/webpack.config.${ mode }`);
};

```
<div class="social open-gh-btn my-4">
  <a class="btn btn-github" href="https://github.com/tobiasbriones/blog/tree/main/mathswe/representation/repsymo/2dp/mrm/feat/drawing-a-tree-on-canvas-with-xy-coordinates/mrm-solution-tree---ep/webpack.config.js" target="_blank">
    <i class="fab fa-github">
      
    </i>
    <strong>
      Open in GitHub
    </strong>
  </a>
</div>