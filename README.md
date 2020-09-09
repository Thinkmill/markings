# 📝 Markings

Never forget a `// TODO` or `// FIXME` again.

Notes added to your code are surfaced visually when a page is rendered so they're always visible in context of what you're building.

Answer _"What's left?"_ with the project wide burn down list of all notes.

## Getting Started

In its simplest form, the Markings CLI generates a report of all `TODO`, `FIXME` & `QUESTION` comments in your code:

```
yarn add @markings/cli @markings/source-comments @markings/output-html
```

And in your `package.json`*:

```json
{
  "scripts": {
    "report": "markings"
  },
  "markings": {
    "sources": [{
      "source": "@markings/source-comments",
      "include": "src/**/*.(j|t)s"
    }],
    "outputs": [{
      "output": "@markings/output-html",
      "filename": "report.html"
    }]
  }
}
```

Finally, run:

```bash
yarn report
```

To generate `report.html`, containing all the detected `TODO`, `FIXME` & `QUESTION` comments in your code.

### React

When used within a React codebase, the special `<Marking>` component allows viewing a report directly in the page.

```
yarn add @markings/react @markings/source-react 
```

Wrap your application in `<MarkingProvider>`

```javascript
import { MarkingProvider } from "@markings/react";

const App = () => (
  <MarkingProvider>
    <div>...</div>
  </MarkingProvider>
);
```

Then add `<Marking>` components around the components you want to mark

```javascript
import { Marking } from "@markings/react";
const MyComponent = () => (
  <div>
    <h1>Hello world</h1>
    <Marking
      description="Get the actual text back from the copywriters"
      purpose="todo"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </Marking>
  </div>
);
```

Now your page will have an inline report of all the detected `<Markings>`.

> ℹ️ The inline report will _not_ include any `TODO` / `FIXME` / `QUESTION` comments.

To include React `<Markings>` along side comments in your report output, add `@markings/source-react` to your `package.json`:

```json
{
  "markings": {
    "sources": [{
      "source": "@markings/source-comments",
      "include": "src/**/*.(j|t)s"
    }, {
      "source": "@markings/source-react",
      "include": "src/**/*.(j|t)s"
    }]
  }
}
```

## Outputs

Outputs work with the Markings CLI to generate reports of all discovered markings.

First, install the cli:

```
yarn add @markings/cli
```

And in your `package.json`*:

```json
{
  "scripts": {
    "report": "markings"
  },
}
```

Then, pick one or more outputs. For every output added, a report will be generated.

### HTML

Generate a good looking html report.

```
yarn add @markings/output-html
```

And in your `package.json`*:

```json
{
  "markings": {
    "outputs": [{
      "output": "@markings/output-html",
      "filename": "report.html"
    }]
  }
}
```

### JSON

Generate a detailed JSON report.

```
yarn add @markings/output-json
```

And in your `package.json`*:

```json
{
  "markings": {
    "outputs": [{
      "output": "@markings/output-json",
      "filename": "report.json"
    }]
  }
}
```

### CSV

Generate a detailed CSV report.

```
yarn add @markings/output-csv
```

And in your `package.json`*:

```json
{
  "markings": {
    "outputs": [{
      "output": "@markings/output-csv",
      "filename": "report.csv"
    }]
  }
}
```

---

_<sup>* In a monorepo? Place this in your root `package.json`.</sup>_
