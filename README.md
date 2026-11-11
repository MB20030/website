# Moritz Beyn — personal website

A responsive personal website adapted from [Showlit](https://github.com/pm25/showlit) by Pin-Yen Huang. It follows the template's sidebar, profile introduction, education and experience panels, and light/dark themes. The implementation remains plain HTML, CSS, and JavaScript so the existing GitHub Pages deployment works without a build step.

Site: **https://mb20030.github.io/website/**

## Edit the site

- `index.html`: biography, experience, education, engagement, skills, contact information, metadata, and the unified Projects & Media collection.
- `styles.css`: layout, light and dark themes, responsive sidebar, project covers, and print styles.
- `script.js`: sidebar controls, theme preference, collection filters, current year, and active navigation.
- `assets/moritz-beyn.png`: original supplied portrait.
- `assets/e-ski.webp`: project image from the official e-SKI website.
- `assets/icons.svg`: local SVG icon sprite; no third-party scripts or fonts.
- `assets/logos/`: official university and company logos, stored locally.

Open `index.html` directly or serve the folder with a static HTTP server. No dependency installation is required. The full collection and all destination links are present in the HTML, including when JavaScript is disabled. The optional filters and theme controls appear when JavaScript is available. The mobile navigation closes with Escape, keeps keyboard focus inside the open menu, and makes the page behind it inert. Theme preference is saved locally, with the system preference used initially.

## Projects & Media

Projects, research, newspaper articles, magazines, radio, and podcasts share one collection and one navigation entry. Optional All / Projects / Media filters narrow the same collection. Each card links directly to the original project or publication. Links to external websites open in a new tab.

To add an entry, copy an existing `.work-card` in `index.html`, set `data-kind` to `project` or `media`, and update its title, description, cover, tags, and destination links. Filter counts are calculated automatically; update the static counts and the `section-number` range for the no-JavaScript fallback. Use a clear destination label: the Unibloom entry links to the company, while the thesis entry links to the public research repository.

## Content sources

Personal background is retained from the existing website, previously based on the supplied CV and portrait. Expected graduation and the incoming OhrConsulting role remain explicitly marked.

- [Bachelor thesis repository](https://github.com/MB20030/BA_Thesis): the README supplies the title, research question, data period, and methodology. This is a public repository link; the private CV is not published.
- [e-SKI](https://e-ski.ch/): project description and [project photograph](https://e-ski.ch/wp-content/uploads/2023/12/eski-hero.webp). The photo is used only to identify the e-SKI project.
- [LEADER, 9 November 2026](https://www.leaderdigital.ch/news/thurgauer-skiantrieb-soll-die-tv-loewen-ueberzeugen-16796.html): e-SKI and its planned Swiss television appearance. The card paraphrases the story and does not imply the appearance has already aired.
- [HSG Campus Conversation #94](https://www.unisg.ch/en/newsroom/podcastdetail/news/campus-conversation-94-with-moritz-beyn/): podcast link retained from the existing website.
- [Unibloom](https://www.unibloom.world/): company destination; internship work is described from the existing website.
- [ALMA 4/2025](https://issuu.com/hsgalumni/docs/alma_4_2025_nichts_ist_mehr_sicher_leben_und_w), pp. 26–27: retained CV/source link.
- [Thurgauer Zeitung portrait](https://www.thurgauerzeitung.ch/ostschweiz/kanton-thurgau/portrait-moritz-beyn-thurgauer-grossratswahlen-2024-ld.2593006): retained CV/source link. Access may require a subscription.

Publication covers are original typographic identifiers and illustrations, not reproductions of the publications' artwork. Education and experience entries use official university and company logos from their websites. Sources are listed in `THIRD_PARTY_NOTICES.md`. No live social feed, analytics, trackers, external embeds, or invented engagement statistics are used.

## GitHub Pages

The existing static deployment is preserved: Settings → Pages → Deploy from a branch → `main` → `/ (root)`. `.nojekyll` serves the files directly. Push reviewed changes to the configured branch to update the public site.

See `THIRD_PARTY_NOTICES.md` for the Showlit template attribution and MIT license.
