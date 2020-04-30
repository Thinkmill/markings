import * as React from "react";
import { MarkingProvider } from "@markings/react";

import "./index.css";

const config = {
  resolveIssueCreatePath: ({ description, purpose }) =>
    `https://github.com/thinkmill/markings/issues/new?title=${purpose}&body=${encodeURIComponent(
      description
    )}`,
  resolveIssuePath: (id) =>
    `https://github.com/thinkmill/markings/issues/${id}`,
  resolvePrPath: (id) => `https://github.com/thinkmill/markings/pull/${id}`,
};

export default ({ Component, pageProps }) => (
  <MarkingProvider config={config}>
    <Component {...pageProps} />
  </MarkingProvider>
);
