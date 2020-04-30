import * as React from "react";
import { Marking } from "@markings/react";

export default () => (
  <div
    style={{
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 640,
      paddingLeft: 20,
      paddingRight: 20,
    }}
  >
    <h1>Markings: Note</h1>
    <p>This is the dev environment for building markings' UI.</p>
    <hr />
    <Marking
      description="Spike how easy it would be to enhance the view panel with issue data"
      purpose="todo"
      issue="8"
    >
      <p>I should have a related note...</p>
    </Marking>
    {paragraphArray.map((p, i) => (
      <Marking key={i} description={p} purpose={i > 9 ? "todo" : "question"}>
        <p>I should have a related note...</p>
      </Marking>
    ))}
  </div>
);

const paragraphArray = [
  "Amet soufflé carrot cake tootsie roll jelly-o chocolate cake.",
  "Chocolate bar gummies sweet roll macaroon powder sweet tart croissant.",
  "Pastry ice cream bear claw cupcake topping caramels jelly beans chocolate cheesecake.",
  "Candy canes pastry cake tart powder.",
  "Tootsie roll bear claw sesame snaps candy cheesecake caramels cookie.",
  "Lemon drops donut marzipan gummi bears cotton candy cotton candy jelly-o carrot cake.",
  "Lemon drops pastry apple pie biscuit tart tootsie roll.",
  "Brownie icing chupa chups cake cookie halvah gummi bears halvah.",
  "Sesame snaps donut gingerbread marshmallow topping powder.",
  "Biscuit chocolate cheesecake pudding candy canes tart halvah sweet.",
  "Sugar plum cake candy carrot cake.",
  "Ice cream marzipan liquorice candy canes sesame snaps danish soufflé lollipop candy canes.",
  "Lemon drops cotton candy pudding.",
  "Pie cake soufflé cupcake jujubes sugar plum.",
  "Liquorice lollipop oat cake.",
];
