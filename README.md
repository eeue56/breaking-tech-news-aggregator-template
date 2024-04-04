# breaking-tech-news-aggregator-template
A template for generating a curated link aggregator for breaking tech news stories

To get started:
- Add stories to this table. You can change the headers, but keep the order.
- On push, Github Actions will build the [docs][./docs] folder will all the different pages needed to make the site as a static site.
- Enable Github pages and set it to run from the main branch and the /docs folder.
- Edit [index.html](./index.html) to add your custom styling or page titles.

| [Title](url) | date as a number | score | summary | why it's relevant | topic, seperated by commas |
| ------------ | ---------------- | ----- | ------- | ----------------- | -------------------------- |
| [Some example](https://example.com) | 1711992907255 | 120 | Example is a great place to test out different things | Every developer should know about it. Summaries and relevancy can contain [links](https://example.com), *bold*, or _italic_ | testing, example |