import * as fs from "fs/promises";
import path from "path";
import { renderStories } from "simple-link-aggregator/dist/story";
import { parseIndex } from "./readme";

const sitesDir = "./docs/";
const topicsDir = path.join(sitesDir, "topic");
const domainsDir = path.join(sitesDir, "domain");

/**
 * Create a directory, or do nothing if it exists
 *
 * @param dir A directory to create
 */
async function ensureDirExists(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {}
}

async function main(): Promise<void> {
  console.log(`Ensuring ${sitesDir}, ${topicsDir}, ${domainsDir} exist...`);
  await ensureDirExists(sitesDir);
  await ensureDirExists(topicsDir);
  await ensureDirExists(domainsDir);

  console.log(`Reading README for table of contents...`);
  const readmeContents = (await fs.readFile("README.md"))
    .toString("utf-8")
    .split("\n");

  const index = parseIndex(readmeContents);
  console.log(`Found ${index.stories.length} stories`);

  const template = (await fs.readFile("index.html")).toString("utf-8");

  let filesCreated = 0;

  {
    // the homepage
    const topicLink = "./topic";
    const domainLink = "./domain";

    const homeLink = "./";
    const newLink = "./new";
    const topLink = "./top";

    console.log("Creating homepage...");
    const storiesHtml = renderStories(
      index.stories,
      "default",
      "",
      topicLink,
      domainLink,
    );

    const homepage = template
      .replace("{title}", index.title)
      .replace("{home}", homeLink)
      .replace("{new}", newLink)
      .replace("{top}", topLink)
      .replace("{contents}", storiesHtml);

    const homepagePath = path.join(sitesDir, "index.html");
    console.log(`Writing to ${homepagePath}`);
    await fs.writeFile(homepagePath, homepage);
    filesCreated++;
  }

  {
    // the /new page
    const topicLink = "./topic";
    const domainLink = "./domain";

    const homeLink = "./";
    const newLink = "./new";
    const topLink = "./top";

    console.log("Creating /new...");
    const storiesHtml = renderStories(
      index.stories,
      "new",
      "",
      topicLink,
      domainLink,
    );

    const new_ = template
      .replace("{title}", index.title)
      .replace("{home}", homeLink)
      .replace("{new}", newLink)
      .replace("{top}", topLink)
      .replace("{contents}", storiesHtml);

    const newPath = path.join(sitesDir, "new.html");
    console.log(`Writing to ${newPath}`);
    await fs.writeFile(newPath, new_);
    filesCreated++;
  }

  {
    // the /top page
    const topicLink = "./topic";
    const domainLink = "./domain";

    const homeLink = "./";
    const newLink = "./new";
    const topLink = "./top";

    console.log("Creating /top...");
    const storiesHtml = renderStories(
      index.stories,
      "top",
      "",
      topicLink,
      domainLink,
    );

    const new_ = template
      .replace("{title}", index.title)
      .replace("{home}", homeLink)
      .replace("{new}", newLink)
      .replace("{top}", topLink)
      .replace("{contents}", storiesHtml);

    const newPath = path.join(sitesDir, "top.html");
    console.log(`Writing to ${newPath}`);
    await fs.writeFile(newPath, new_);
    filesCreated++;
  }

  {
    // each topic page
    const topicLink = "../topic";
    const domainLink = "../domain";

    const homeLink = "../";
    const newLink = "../new";
    const topLink = "../top";

    const allTopics = new Set(index.stories.map((story) => story.topic).flat());
    console.log(`Creating ${allTopics.size} topic pages...`);

    for (const topic of allTopics) {
      const storiesHtml = renderStories(
        index.stories.filter((story) => story.topic.includes(topic)),
        "default",
        "",
        topicLink,
        domainLink,
      );
      const topicPage = template
        .replace("{title}", index.title)
        .replace("{home}", homeLink)
        .replace("{new}", newLink)
        .replace("{top}", topLink)
        .replace("{contents}", storiesHtml);

      const topicPath = path.join(topicsDir, `${topic}.html`);
      console.log(`Writing to ${topicPath}`);
      await fs.writeFile(topicPath, topicPage);
      filesCreated++;
    }
  }

  {
    // each domain page
    const topicLink = "../topic";
    const domainLink = "../domain";

    const homeLink = "../";
    const newLink = "../new";
    const topLink = "../top";

    const allDomains = new Set(
      index.stories.map((story) => {
        const url = new URL(story.link);
        return url.hostname;
      }),
    );
    console.log(`Creating ${allDomains.size} domain pages...`);

    for (const domain of allDomains) {
      const storiesHtml = renderStories(
        index.stories.filter((story) => story.link.includes(domain)),
        "default",
        "",
        topicLink,
        domainLink,
      );
      const domainPage = template
        .replace("{title}", index.title)
        .replace("{home}", homeLink)
        .replace("{new}", newLink)
        .replace("{top}", topLink)
        .replace("{contents}", storiesHtml);

      const domainPath = path.join(domainsDir, `${domain}.html`);
      console.log(`Writing to ${domainPath}`);
      await fs.writeFile(domainPath, domainPage);
      filesCreated++;
    }
  }

  console.log(
    `Done! Created ${filesCreated} files. Check out the ./docs directory.`,
  );
}

main();
