import { Purpose } from "@markings/types";

type Props = {
  purpose: Purpose;
  details: string;
  heading?: string;
};

export { NoteProvider, Note } from "./note/Note";
