import React from "react";
import { Output } from "@markings/types";
import { renderToStaticMarkup } from "react-dom/server";
import { NotePanel } from "./NotePanel";

export const output: Output = {
  getFile(markings) {
    return `<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8" />
    <meta
        name="viewport"
        content="width=device-width,minimum-scale=1,initial-scale=1"
    />
    <style>html, body {
      padding:0;
      margin:0;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;    }</style>
    </head>
    <body>
        ${renderToStaticMarkup(<NotePanel markings={markings} />)}
    </body>
</html>`;
  }
};
