import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';

interface GetOrderCustomerNoteResponse {
  order: {
    customer: {note: string | null} | null;
  } | null;
}

type BarcodeState =
  | {status: 'loading'}
  | {status: 'ready'; note: string}
  | {status: 'empty'}
  | {status: 'error'};

const QUERY = `
  query GetOrderCustomerNote($id: ID!) {
    order(id: $id) {
      customer {
        note
      }
    }
  }
`;

export default function extension() {
  render(<BarcodeBlock />, document.body);
}

function BarcodeBlock() {
  const orderId = shopify.data.selected?.[0]?.id;
  const [barcode, setBarcode] = useState<BarcodeState>({status: 'loading'});

  useEffect(() => {
    if (!orderId) {
      setBarcode({status: 'error'});
      return;
    }

    let active = true;
    setBarcode({status: 'loading'});

    void shopify
      .query<GetOrderCustomerNoteResponse>(QUERY, {
        variables: {id: orderId},
        version: '2026-01',
      })
      .then(({data, errors}) => {
        if (errors?.length) {
          throw new Error('Shopify returned errors when loading the customer note.');
        }

        if (!active) return;

        const note = data?.order?.customer?.note?.trim();
        setBarcode(note ? {status: 'ready', note} : {status: 'empty'});
      })
      .catch((error: unknown) => {
        console.error('Error fetching customer note:', error);
        if (active) setBarcode({status: 'error'});
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <s-admin-block heading="Store Barcode">
      {barcode.status === 'ready' ? (
        <s-stack alignItems="center">
          <s-image
            alt="Customer note Code 128 barcode"
            src={`https://barcodeapi.org/api/128/${encodeURIComponent(barcode.note)}`}
            aspectRatio="4/1"
            inlineSize="auto"
            objectFit="contain"
          />
        </s-stack>
      ) : (
        <s-text>
          {barcode.status === 'loading'
            ? 'Loading barcode...'
            : barcode.status === 'empty'
              ? 'No customer note found.'
              : 'Unable to load customer note.'}
        </s-text>
      )}
    </s-admin-block>
  );
}
