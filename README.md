# Barcode Display - Shopify Admin Block Extension

This is a Shopify Admin Block Extension that displays the customer note associated with an order in the admin order details page. The extension fetches the note using Shopify's Admin GraphQL API.

## Features

- Extracts the `customer.note` field from the selected order.
- Displays the customer note within the Shopify admin order details page.
- Uses the Shopify Admin API for secure data retrieval.

## Installation

### Prerequisites

- A Shopify Partner account
- A Shopify development store
- The Shopify CLI installed
- Node.js (Latest LTS version recommended)

### Setup Instructions

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/andyhuiSS/barcode-display.git
   cd barcode-display
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Authenticate with Shopify:**

   ```sh
   shopify login --store your-store-name
   ```

4. **Register the App with Shopify:**

   ```sh
   shopify app create extension
   ```

   Follow the prompts and select `Admin Block Extension`.

5. **Run the Extension Locally:**

   ```sh
   shopify app dev
   ```

   This will start a local development server and provide a preview link.

## Usage

Once installed and running, the extension will appear in the Shopify admin under **Order Details**. It will:

- Retrieve the selected order's customer note.
- Display the note inside a block labeled `Store Barcode`.

## Code Structure

- `src/BlockExtension.tsx`: Main React component for the admin block.
- `shopify.extension.toml`: Configuration file specifying the extension type and target.
- `package.json`: Lists dependencies and scripts.

## Troubleshooting

### "Expected Hash to be a String" Error

Ensure the GraphQL query is formatted correctly:

```js
query({
  query: `query GetOrderCustomerNote($id: ID!) {
    order(id: $id) {
      customer {
        note
      }
    }
  }`,
  variables: {
    id: "gid://shopify/Order/1234567890"
  }
});
```

### "Error fetching customer note"

- Check the browser console (`F12 > Console`) for the GraphQL response.
- Verify the Admin API access scope includes `read_orders`.

### "Order Data: undefined"

- Ensure `data.selected[0]` contains a valid `id`.
- Log `data` to confirm structure: `console.log(data);`

## License

MIT License

## Author

Andrew Hui

## Contributing

Pull requests are welcome! Please follow best practices and submit issues if you encounter any problems.

