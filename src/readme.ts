import { story } from "simple-link-aggregator";

type Story = story.Story;
const { Story } = story;

type PieceIndex = {
  readonly title: 1;
  readonly date: 2;
  readonly score: 3;
  readonly summary: 4;
  readonly relevency: 5;
  readonly topics: 6;
};

const EXPECTED_NUMBER_OF_PIECES =
  "| [Title](url) | date as a number | score | summary | why it's relevant | topic, seperated by commas |".split(
    "|",
  ).length;

const PIECE_INDEX: PieceIndex = {
  title: 1,
  date: 2,
  score: 3,
  summary: 4,
  relevency: 5,
  topics: 6,
};

/** Parsing state - described as a string */
type ReadingTableState =
  | "not seen yet"
  | "read header"
  | "reading body"
  | "done";

export type Index = {
  title: string;
  stories: Story[];
};

// /**
//  * @param str A string containing possible links
//  * @returns A string with the urls turned into html
//  */
// function simpleLinkify(str: string): string {
//   const linkRegex = /\[(.+?)\]\((.+?)\)/g;

//   return str.replaceAll(linkRegex, (substring, text, url): string => {
//     console.log("got", text, url);
//     return `<a href="${url}">${text}</a>`;
//   });
// }

/**
 * Parse the README to get the list of links, and the title of the repo.
 *
 * The list of links must be in a table, with the following columns:
 *
 * | [Title](url)                        | date as a number | score | summary                                               | why it's relevant                    | topic, seperated by commas |
 * | ----------------------------------- | ---------------- | ----- | ----------------------------------------------------- | ------------------------------------ | -------------------------- |
 * | [Some example](https://example.com) | 1711992907255    | 120   | Example is a great place to test out different things | Every developer should know about it | testing, example           |
 *
 * Summary / relevant should be just plain text.
 *
 * @param contents The lines of README.md
 * @returns A list of valid stories
 */
export function parseIndex(contents: string[]): Index {
  const links: Story[] = [];
  let readingTableState: ReadingTableState = "not seen yet";
  let lineNumber = 0;
  const readmeTitle = contents[0].split("#")[1].trim();

  for (const line of contents) {
    lineNumber++;
    const isInTable = line.startsWith("|") && line.endsWith("|");

    switch (readingTableState) {
      case "not seen yet": {
        if (isInTable) {
          readingTableState = "read header";
        }
        break;
      }
      case "read header": {
        if (isInTable) {
          readingTableState = "reading body";
        } else {
          readingTableState = "done";
        }
        break;
      }
      case "reading body": {
        if (isInTable) {
          const pieces = line.split("|");

          if (pieces.length < EXPECTED_NUMBER_OF_PIECES) {
            console.log(
              `Line ${lineNumber} didn't have enough table cell separators (|), expected ${EXPECTED_NUMBER_OF_PIECES} but got ${pieces.length}, skipping: "${line}"`,
            );
            break;
          }

          const linkRegex = /\[(.+)\]\((.+)\)/;
          const linkMatch = pieces[PIECE_INDEX.title].match(linkRegex);

          if (linkMatch) {
            const title = linkMatch[1];
            const url = linkMatch[2];
            const time = parseInt(pieces[PIECE_INDEX.date].trim());
            const date = isNaN(time) ? new Date() : new Date(time);
            const topics = pieces[PIECE_INDEX.topics]
              .split(",")
              .map((x) => x.trim());
            const summary = pieces[PIECE_INDEX.summary].trim();
            const relevancy = pieces[PIECE_INDEX.relevency].trim();
            const score = parseInt(pieces[PIECE_INDEX.score].trim() || "0");

            links.push(
              Story(
                lineNumber,
                date,
                url,
                title,
                topics,
                summary,
                relevancy,
                score,
              ),
            );
          } else {
            console.log(
              `Couldn't read link at line ${lineNumber}, skipping: "${line}"`,
            );
          }
        }
        break;
      }
      case "done": {
        return {
          title: readmeTitle,
          stories: links,
        };
      }
    }
  }

  return {
    title: readmeTitle,
    stories: links,
  };
}
