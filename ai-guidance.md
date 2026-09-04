To implement footnotes in HTML, you do not need a single specific "metadata" block; rather, you are required to use a specific pair of semantic elements: the `<footer>` element (or more commonly, the `<aside>` element for a list of notes) and the `<cite>` or `<span>` element for the footnote marker, but the core requirement is the use of the **`<footer>`** element to contain the footnote content if it is at the end of the section, or simply a container like `<div>` or `<aside>` with appropriate linking.

However, the most standard and semantic way to implement footnotes in HTML5 involves two key components:

1.  **The Footnote Marker:** A link in the body text that points to the footnote. This is typically an `<a>` element with an `id` target.
2.  **The Footnote Content:** The actual text of the footnote. This is often placed in a `<footer>` element if it applies to the whole section, or in a `<div>` or `<aside>` element.

But there is a more precise interpretation of "metadata markup" in this context. In HTML, footnotes are primarily managed through **anchors** (using the `id` attribute) and **links** (using the `href` attribute). There is no dedicated `<footnote>` tag in HTML5.

Here is the required markup structure:

### 1. The Footnote Reference (in the body text)
You need an anchor link that points to the footnote content. This is usually a superscript number or symbol.

```html
<p>
  This is an example sentence with a footnote<sup><a id="fnref:1" href="#fn:1">1</a></sup> to explain the context.
</p>
```

### 2. The Footnote Content (at the end of the section or page)
The footnote content itself must have a corresponding `id` that matches the `href` of the reference. It is best practice to wrap this in a `<footer>` element if it applies to the entire section, or a `<div>` or `<aside>` for a list of footnotes.

```html
<footer>
  <ol>
    <li id="fn:1">
      <a href="#fnref:1">↩</a> This is the text of the first footnote.
    </li>
  </ol>
</footer>
```

### Key Metadata/Attributes Required:
*   **`id` attribute:** On the footnote content element (e.g., `<li id="fn:1">`) to serve as the target for the link.
*   **`href` attribute:** On the link in the body text (e.g., `<a href="#fn:1">`) to point to the `id`.
*   **`id` attribute:** On the link in the body text (e.g., `<a id="fnref:1">`) to allow for a "back" link from the footnote.
*   **`href` attribute:** On the back link inside the footnote (e.g., `<a href="#fnref:1">`) to point back to the reference.

### Best Practices:
*   **Use `<footer>` for the container:** If the footnotes apply to the entire section or article, wrap them in a `<footer>` element. This provides semantic meaning that this content is related to the section it is in.
*   **Use `<aside>` for sidebars:** If the footnotes are displayed in a sidebar, use `<aside>`.
*   **Use `<sup>` for markers:** The footnote marker in the text should be wrapped in a `<sup>` element for proper vertical alignment.
*   **Accessibility:** Ensure that the links are keyboard navigable and that the text is clear. The `id` and `href` pairing ensures that assistive technologies can navigate between the reference and the content.

### Example of Complete Implementation:

```html
<article>
  <h1>Article Title</h1>
  <p>
    This is a statement that requires a citation<sup><a id="fnref:1" href="#fn:1">1</a></sup> and another point<sup><a id="fnref:2" href="#fn:2">2</a></sup>.
  </p>
  
  <footer>
    <ol>
      <li id="fn:1">
        <a href="#fnref:1">↩</a> Citation for the first statement.
      </li>
      <li id="fn:2">
        <a href="#fnref:2">↩</a> Additional context for the second point.
      </li>
    </ol>
  </footer>
</article>
```

In summary, the required "metadata" is the **`id`** and **`href`** attributes that create the bidirectional link between the footnote marker and the footnote content, typically structured within a **`<footer>`** element for semantic correctness.