/** Renders a JSON-LD <script> tag, escaping `<` so embedded data can't break out of the script context. */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
