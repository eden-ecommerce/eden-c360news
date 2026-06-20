import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { ErrorCard } from "@components/ui/ErrorCard";
import { NsLink } from "@components/ns-link";
import { getHeader } from "@lib/sanity/get-header";
import { isSanityEnvConfigured } from "@lib/env-configured.server";

function NavLink({ href, text }: { href: string; text: string }) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        className="text-sm text-foreground hover:underline"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <NsLink href={href} className="text-sm text-foreground hover:underline">
      {text}
    </NsLink>
  );
}

export async function Navbar() {
  if (!isSanityEnvConfigured()) {
    return (
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <IntegrationEnvError integration="sanity" className="border-0 bg-transparent p-0" />
        </div>
      </header>
    );
  }

  const header = await getHeader();

  if (!header) {
    return (
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <ErrorCard
            title="Navigation unavailable"
            message="Header content could not be loaded. Check Sanity credentials and try again."
            envVars={["EDEN_SANITY_PROJECT_ID", "EDEN_SANITY_DATASET", "EDEN_SANITY_API_DEVELOPER_TOKEN"]}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-6">
        {header.title ? (
          <span className="text-sm font-semibold text-foreground">{header.title}</span>
        ) : (
          <span className="text-sm font-semibold text-foreground">App</span>
        )}

        <nav className="flex items-center gap-4">
          {header.navigationLinks.map((link) => (
            <NavLink key={`${link.href}-${link.text}`} href={link.href} text={link.text} />
          ))}
        </nav>

        {header.phoneNumber ? (
          <span className="text-sm text-muted-foreground">{header.phoneNumber}</span>
        ) : null}
      </div>
    </header>
  );
}
