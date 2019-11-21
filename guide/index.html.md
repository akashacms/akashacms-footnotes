---
layout: plugin-documentation.html.ejs
title: AskashaCMS Footnotes plugin documentation
---

Footnotes are widely used in writing to cite references or add additional comments.  The AkashaCMS Footnotes implementation is inspired by Wikipedia in that the footnote inserts an in-page link at the footnote's location, and generates a list of citations at the bottom of the page.  Like this: <footnote name="AkashaCMS" href="https://akashacms.com" title="Build the website of your dreams"/>

The code to generate that footnote:

```html
<footnote name="AkashaCMS" href="https://akashacms.com" title="Build the website of your dreams"/>
```

# Installation

Add the following to `package.json`

```json
"dependencies": {
    ...
    "@akashacms/plugins-footnotes": "^0.7.x",
    ...
}
```

Once added to `package.json` run: `npm install`

# Configuration

Add the following to `config.js`

```js
config
    ...
    .use(require('@akashacms/plugins-footnotes'))
    ...
```

# Custom Tags

Example.

```html
<footnote name="everything"
    href="http://every.thing"
    title="With Title and all the fixings"
    rel="relative">
    A footnote with everything and all the fixings
    </footnote>
```

Example.

```html
<footnote-ref name="footnote-name"></footnote-ref>
```
