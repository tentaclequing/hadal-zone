# IPFS Footer Link -- Implementation Note

## For the theme/footer agent

The site footer template (in `themes/hadal/layouts/partials/footer.html` or
equivalent) should include a link to the IPFS-hosted version of hadal-zone.

### What to display

Add a small link or badge in the footer with text like:

> Also available on [IPFS](https://w3s.link/ipfs/{{ .Site.Params.ipfsGateway }})

Or, if `ipfsGateway` is empty (not yet deployed), hide the link entirely.

### Template logic (Hugo)

```html
{{ with .Site.Params.ipfsGateway }}
<div class="ipfs-link">
  <a href="https://w3s.link/ipfs/{{ . }}" rel="noopener" target="_blank">
    Available on IPFS
  </a>
  <span class="ipfs-note">
    Decentralised mirror -- pin this CID to help keep hadal-zone alive.
  </span>
</div>
{{ end }}
```

### Configuration

The `ipfsGateway` parameter is defined in `hugo.toml` under `[params]`.
It is updated automatically by the CI/CD pipeline after each IPFS pinning
(see `.github/workflows/deploy.yml`, the `ipfs-pin` job).

The value is the root CID (e.g., `bafybeig...`), not a full URL.
The template constructs the full gateway URL.

### Internationalisation

Use the i18n system for the link text:

- English: "Available on IPFS"
- German: "Auch auf IPFS verfuegbar"

The tooltip / note text:

- English: "Decentralised mirror -- pin this CID to help keep hadal-zone alive."
- German: "Dezentraler Spiegel -- pinne diese CID, um hadal-zone am Leben zu halten."

### Accessibility

- The link should have `rel="noopener"` and `target="_blank"`.
- Include `aria-label` for screen readers: "Access hadal-zone via IPFS decentralised network".
- The IPFS badge/icon (if used) should have appropriate alt text.
