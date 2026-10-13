# Barcode Display - Shopify Admin block extension

Shows a Code 128 barcode generated from the order customer’s `note` on the Shopify Admin order details page. The extension runs at `admin.order-details.block.render` using API version `2026-01` and Polaris web components (Preact).

## How it works

1. Reads the selected order’s GID from `shopify.data.selected[0].id`.
2. Uses the authenticated `shopify.query()` Admin GraphQL API to retrieve `order(id) { customer { note } }`.
3. If a non-empty note exists, renders a barcode image through `https://barcodeapi.org/api/128/` with the value URL-encoded. Otherwise, shows an informative empty or error state; it never generates a barcode for a loading/error placeholder.

The existing `read_orders` and `read_customers` scopes are retained. A guest order or an order whose customer has no note will show `No customer note found.`

**Privacy:** The customer note is included in the request URL to the third-party barcode service (`barcodeapi.org`). Do not use this extension with notes containing personal or confidential data unless that data transfer has been approved. This behavior predates the migration.

## Setup and validation

1. Install a currently supported Node.js LTS version and the current Shopify CLI (`npm install -g @shopify/cli`).
2. In the repository root, run `npm install` to resolve Preact and the 2026-01 UI extension packages and **regenerate `package-lock.json`**. Commit the generated lockfile before merging this migration.
3. Run `shopify app dev` with the existing app and a development store. The Shopify CLI generates `extensions/customer-note-barcode/shopify.d.ts` for the `shopify` global.
4. Run `npx tsc --noEmit -p extensions/customer-note-barcode/tsconfig.json` and `shopify app build`.
5. Preview the Order details block against (a) an order whose customer note contains a scannable barcode, (b) an order without a customer note, and (c) a guest order. Confirm the image loads from the barcode provider and is scannable.
6. Review extension bundle size. Once verified, deploy with `shopify app deploy` to create an updated app version. Deployment is not part of this source change.

**Note:** This app’s App Home and auth URLs in `shopify.app.toml` still use Shopify’s template placeholders. They were deliberately left unchanged; validate them separately if using the embedded App Home, as the migration only touches the order-details extension.

## Upgrade notes (2025-01 to 2026-01)

- Replaces `reactExtension`, `render("Playground", ...)`, `useApi`, legacy `AdminBlock`/`Image`/`InlineStack` with the Preact entry point, `shopify.data` / `shopify.query`, and `s-admin-block` / `s-image` / `s-stack`.
- Leaves the order-to-customer-note GraphQL query and extension target unchanged: both remain available in 2026-01.
- Updates the extension and webhook API version to `2026-01`.
- Removes the older React UI extension dependencies; the pre-existing root lockfile must be regenerated against the new workspace dependencies.

Relevant Shopify docs:
- [Upgrading Admin UI extensions to Polaris web components](https://shopify.dev/docs/apps/build/admin/upgrading-to-2025-10)
- [Admin UI extension API (2026-01)](https://shopify.dev/docs/api/admin-extensions/2026-01)
- [Admin GraphQL Customer (2026-01)](https://shopify.dev/docs/api/admin-graphql/2026-01/objects/Customer)
