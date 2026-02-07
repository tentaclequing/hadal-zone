# Contributing to hadal-zone

Welcome, and thank you for considering a contribution to **hadal-zone** -- a decentralised library for resilience, mutual aid, and skillsharing. This project exists to collect and preserve practical knowledge that helps people organise, protect themselves, support one another, and build collective power. Every document added makes the library harder to erase and more useful to the communities it serves.

You do not need to be a developer to contribute. If you have a guide, a zine, a how-to, a legal reference, or any practical document that could help someone, you belong here.

## How to add a new document

1. **Fork the repository** on GitHub.

2. **Create a folder** for your document under the appropriate language and category:

   ```
   content/<language>/<category>/<your-document-slug>/
   ```

   For example: `content/en/mutual-aid/community-fridge-setup/`

3. **Create an `index.md`** inside your new folder with the required front matter:

   ```markdown
   ---
   title: "How to Set Up a Community Fridge"
   author: "anemone"
   tldr: "Step-by-step guide for starting and maintaining a community fridge in your neighbourhood."
   categories: ["mutual-aid"]
   tags: ["food", "community", "logistics"]
   date: 2026-01-15
   translationKey: "community-fridge-setup"
   ---

   Your document content goes here in Markdown.
   ```

4. **Add your files** (PDFs, images, diagrams, etc.) in the same folder alongside `index.md`.

5. **If you are including a PDF**, you **must** also include an accessible `.md` text version with the same content. PDFs are not accessible to all readers, and the Markdown version ensures everyone can read the document. Name it descriptively, e.g. `community-fridge-setup.md`.

6. **Open a Pull Request** with a clear description of what you are contributing.

## How to submit a translation

Translations make the library accessible across languages and borders. Content can and should be adapted for local laws, customs, and context -- translations are not required to be literal.

1. **Find the original document** you want to translate and note its `translationKey` value from the front matter.

2. **Create the equivalent folder** in the target language's content directory:

   ```
   content/<target-language>/<category>/<document-slug>/
   ```

   For example, translating `content/en/mutual-aid/community-fridge-setup/` to German:

   ```
   content/de/mutual-aid/community-fridge-setup/
   ```

3. **Create `index.md`** with front matter that uses the **same `translationKey`** as the original:

   ```markdown
   ---
   title: "Wie man einen Gemeinschafts-Kühlschrank einrichtet"
   author: "anemone"
   tldr: "Schritt-für-Schritt-Anleitung zur Einrichtung und Pflege eines Gemeinschafts-Kühlschranks."
   categories: ["mutual-aid"]
   tags: ["Lebensmittel", "Gemeinschaft", "Logistik"]
   date: 2026-01-20
   translationKey: "community-fridge-setup"
   ---
   ```

4. **If the content differs substantially** from the original (adapted for local laws, customs, or context), set `adapted: true` and add an `adaptation_note` explaining what changed:

   ```yaml
   adapted: true
   adaptation_note: "Adapted for German food safety regulations and local council requirements."
   ```

## Metadata field reference

| Field              | Required? | Description                                                                 | Example                              |
|--------------------|-----------|-----------------------------------------------------------------------------|--------------------------------------|
| `title`            | Yes       | The title of the document                                                   | `"How to Set Up a Community Fridge"` |
| `author`           | Yes       | Author name, or `"anemone"` for anonymous contributions                     | `"anemone"`                          |
| `tldr`             | Yes       | A one- or two-sentence summary of the document                              | `"Step-by-step guide for starting a community fridge."` |
| `categories`       | Yes       | List of categories (usually one) from the categories below                  | `["mutual-aid"]`                     |
| `tags`             | Yes       | List of descriptive tags for discoverability                                | `["food", "community"]`             |
| `date`             | Yes       | Publication date in YYYY-MM-DD format                                       | `2026-01-15`                         |
| `translationKey`   | Yes       | A unique key shared across all translations of the same document            | `"community-fridge-setup"`           |
| `license`          | No        | Per-document license override; defaults to CC BY-SA 4.0 if omitted          | `"CC0 1.0"`                          |
| `adapted`          | No        | Set to `true` if the translation substantially differs from the original    | `true`                               |
| `adaptation_note`  | No        | Explanation of how and why the content was adapted                          | `"Adapted for German food safety regulations."` |

## Categories

The library is organised into eight categories. Choose the one that best fits your document:

| Category            | Description                                                                                  |
|---------------------|----------------------------------------------------------------------------------------------|
| `skillsharing`      | Practical skills and how-to guides -- repair, cooking, first aid, toolmaking, and more        |
| `protest-safety`    | Guides for staying safe at protests, demonstrations, and direct actions                       |
| `movement`          | Organising strategy, coalition-building, movement history, and political education             |
| `mutual-aid`        | Setting up and running mutual aid projects -- food distribution, supply networks, care webs   |
| `legal`             | Know-your-rights guides, legal observer training, and legal support resources                  |
| `digital-security`  | Protecting your communications, devices, and data -- encryption, anonymity, operational security |
| `wellbeing`         | Mental health, burnout prevention, community care, and sustaining yourself in hard times       |
| `accessibility`     | Making spaces, events, actions, and resources accessible to disabled people                    |

## Review process

All Pull Requests are reviewed before merging. A reviewer will check that:

- The front matter is complete and correctly formatted
- The content is factually accurate to the best of their knowledge
- If a PDF is included, an accessible Markdown text version is also present
- The document fits the scope of the library

Please be patient -- this is a volunteer-run project and reviews may take some time. If your PR needs changes, the reviewer will leave comments explaining what to adjust.

## Anonymous contributions

You do not need to identify yourself to contribute. If you wish to remain anonymous, set the `author` field to `"anemone"` in your document's front matter. No questions asked.

## Code of conduct

This is a library built on trust and solidarity. All contributions must be:

- **In good faith** -- intended to genuinely help people
- **Factually accurate** -- to the best of your knowledge at the time of writing
- **Non-harmful** -- content must not endanger, target, or discriminate against anyone

Contributions that do not meet these standards will not be merged.

## Branch protection

The `main` branch is protected. All changes must go through a Pull Request and be reviewed before they can be merged. Direct pushes to `main` are not permitted. This ensures that every contribution is checked for completeness, accuracy, and good faith before it becomes part of the library.

## Example folder structure

Here is what a complete document contribution looks like in the repository:

```
content/
  en/
    mutual-aid/
      community-fridge-setup/
        index.md                        # Required: document content with front matter
        community-fridge-setup.pdf      # Optional: PDF version
        community-fridge-setup.md       # Required if PDF is included: accessible text version
        fridge-diagram.png              # Optional: supporting images or files
```

And the corresponding translation:

```
content/
  de/
    mutual-aid/
      community-fridge-setup/
        index.md                        # Same translationKey as the English version
        community-fridge-setup.pdf      # Optional: translated PDF
        community-fridge-setup.md       # Required if PDF is included
```
