/**
 * Renders schema.org structured data as JSON-LD.
 *
 * Server component only — the JSON is emitted into the HTML for crawlers and
 * never enters the client bundle.
 */

export type JsonLdNode = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Build-time generated JSON objects. Escaping "<" prevents a
          // premature </script> if a content string ever contains markup.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
