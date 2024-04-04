# breaking-tech-news-aggregator-template
A template for generating a curated link aggregator for breaking tech news stories.

## Why you might want this

It's hard to keep track of links when a breaking tech news story comes out, so if you're trying to keep track of what you've seen, how important it is, and a summary of it, this is a good place to start.

## Usage

To get started:
- Edit [index.html](./index.html) to add your custom styling or page titles.
- Edit [build.yml](./.github/workflows/build.yml) to have the name and email you want.
- Add stories to this table. You can change the headers, but keep the order.
- On push, Github Actions will build the [docs](./docs) folder will all the different pages needed to make the site as a static site.
- Enable Github pages and set it to run from the main branch and the /docs folder.
- Checkout [this repo's pages](https://eeue56.github.io/breaking-tech-news-aggregator-template/) if you want to see a demo.

| [Title](url) | date as a number | score | summary | why it's relevant | topic, seperated by commas |
| ------------ | ---------------- | ----- | ------- | ----------------- | -------------------------- |
| [Some example](https://example.com) | 1711992907255 | 120 | Example is a great place to test out different things | Every developer should know about it. Summaries and relevancy can contain [links](https://example.com), *bold*, or _italic_ | testing, example |