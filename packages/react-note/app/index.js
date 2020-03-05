import ReactDOM from "react-dom";

const config = {
  resolveIssueCreatePath: ({ description, purpose }) =>
    `https://github.com/thinkmill/markings/issues/new?title=${purpose}&body=${encodeURIComponent(
      description
    )}`,
  resolveIssuePath: id => `https://github.com/thinkmill/markings/issues/${id}`,
  resolvePrPath: id => `https://github.com/thinkmill/markings/pull/${id}`
};

const App = () => {
  return (
    <NoteProvider config={config}>
      <h1>Markings: Note</h1>
      <p>This is the dev environment for building markings' UI.</p>
    </NoteProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
