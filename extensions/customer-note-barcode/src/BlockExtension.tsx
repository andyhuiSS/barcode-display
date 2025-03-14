import React, { useEffect, useState } from "react";
import { reactExtension, useApi, AdminBlock, BlockStack, Text, Image, InlineStack } from "@shopify/ui-extensions-react/admin";
import { render } from '@shopify/ui-extensions-react/admin';

render('Playground', () => <App />)

const TARGET = "admin.order-details.block.render";

// Define TypeScript interfaces for the GraphQL response
interface Customer {
  note: string | null; // Note can be null if no note exists
}

interface Order {
  customer: Customer | null; // Customer can also be null
}

interface GetOrderCustomerNoteResponse {
  order: Order;
}

export default reactExtension(TARGET, () => <App />);

function App() {
  const { data, query } = useApi(TARGET);
  const [customerNote, setCustomerNote] = useState<string>("Loading...");

  useEffect(() => {
    if (!data || !data.selected || data.selected.length === 0) {
      console.error("No order selected.");
      return;
    }

    // Extract order ID and type it as a string
    const orderId: string = data.selected[0]?.id;

    if (!orderId) {
      console.error("Error: Order ID is undefined or null.");
      return;
    }

    console.log("Order ID:", orderId);

    // Use the 'query' function directly if available
    query<GetOrderCustomerNoteResponse>(
      `
        query GetOrderCustomerNote($id: ID!) {
          order(id: $id) {
            customer {
              note
            }
          }
        }
      `,
      {
        variables: {
          id: orderId,
        },
      }
    )
      .then((response) => {
        console.log("GraphQL Response:", response);
        if (response.data?.order?.customer?.note) {
          setCustomerNote(response.data.order.customer.note);
        } else {
          setCustomerNote("No note found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching customer note:", error);
        setCustomerNote("Error loading note.");
      });
  }, [data, query]);

  const barcodeUrl = `https://barcodeapi.org/api/128/${customerNote}`;

  return (
    
    <AdminBlock title="Store Barcode">
    <InlineStack inlineAlignment="center">
        <Image alt="barcode" source={barcodeUrl} />
        </InlineStack>
    </AdminBlock>
    
  );
}
