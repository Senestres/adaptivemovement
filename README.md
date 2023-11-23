Run Eleventy

Generate a production-ready build to the `docs` folder:

```
npm run build
```

Or build and host on a local development server:

```
npm start
```

<h1>To do</h1>
Tags
    put list of tags somewhere (sidebar ?)

post img
    caption from markdown
    make cover img responsive + set max height

(add a grid or flex system -> two posts side by side)

use eleventy image plugin for background
    use also on other images

    {% image "cat.jpg", "photo of my tabby cat", "(min-width: 30em) 50vw, 100vw" %}