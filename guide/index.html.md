---
layout: plugin-documentation.html.ejs
title: AskashaCMS Footnotes plugin documentation
---

Footnotes are widely used in writing to cite references or add additional comments.  The AkashaCMS Footnotes implementation is inspired by Wikipedia in that the footnote inserts an in-page link at the footnote's location, and generates a list of citations at the bottom of the page.  Like this: <footnote name="AkashaCMS" href="https://akashacms.com" title="Build the website of your dreams"/>

The code to generate that footnote:

```
<footnote name="AkashaCMS" href="https://akashacms.com" title="Build the website of your dreams"/>
```

# Installation

Add the following to `package.json`

```
"dependencies": {
    ...
    "akashacms-footnotes": "akashacms/akashacms-footnotes#akasharender",
    ...
}
```

The AkashaRender version of `akashacms-footnotes` has not been published to `npm` yet, and therefore must be referenced this way.

Once added to `package.json` run: `npm install`

# Configuration

Add the following to `config.js`

```
config
    ...
    .use(require('akashacms-footnotes'))
    ...
```

# Custom Tags


TODO - Have not written this yet.  Study the source code for clues.
