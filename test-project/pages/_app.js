import * as React from "react";
import { NoteProvider } from "@markings/react-note";

import "./index.css";

const config = {
  resolveIssueCreatePath: ({ description, purpose }) =>
    `https://github.com/thinkmill/markings/issues/new?title=${purpose}&body=${encodeURIComponent(
      description
    )}`,
  resolveIssuePath: id => `https://github.com/thinkmill/markings/issues/${id}`,
  resolvePrPath: id => `https://github.com/thinkmill/markings/pull/${id}`
};

export default ({ Component, pageProps }) => (
  <NoteProvider config={config}>
    <Component {...pageProps} />
  </NoteProvider>
);
