export default function TemplatesPage() {
  const demoAppUrl = process.env.NEXT_PUBLIC_DEMO_APP_URL ?? "http://localhost:3001";

  return (
    <article className="doc-page templates-page">
      <div>
        <p className="doc-kicker">Templates</p>
        <h1>Explore the Nerio workspace template.</h1>
        <p className="doc-lede">
          A live embedded preview of the Demo App, built from Nerio Core components and tokens.
        </p>
      </div>
      <iframe
        className="templates-demo-frame"
        src={demoAppUrl}
        title="Nerio Demo App"
        allow="clipboard-read; clipboard-write"
      />
    </article>
  );
}
