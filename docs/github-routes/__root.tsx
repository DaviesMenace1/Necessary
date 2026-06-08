import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-4">Not Found</p>
        <h1 className="font-serif text-7xl font-medium text-foreground">404</h1>
        <p className="mt-6 text-muted-foreground">That piece is no longer in our archives.</p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-obsidian px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-canvas transition-colors hover:bg-obsidian/90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-foreground">Something went amiss</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please refresh, or return home and try again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-obsidian px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium text-canvas hover:bg-obsidian/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Revamp UG — Luxury Interior Sourcing in Kampala" },
      {
        name: "description",
        content:
          "Sourcing, importing, and installing the world's finest furniture for Uganda's discerning homes. Boca do Lobo, Fendi Casa, Dolce & Gabbana Casa and more.",
      },
      { name: "author", content: "The Revamp UG" },
      { property: "og:title", content: "The Revamp UG — Luxury Interior Sourcing in Kampala" },
      {
        property: "og:description",
        content:
          "From Milan to Kampala. Curated furniture from the world's most storied design houses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Revamp UG — Luxury Interior Sourcing in Kampala" },
      {
        name: "description",
        content:
          "Design Source Hub is a multi-page website for an interior design business offering sourcing, importing, installation, and architecture services.",
      },
      {
        property: "og:description",
        content:
          "Design Source Hub is a multi-page website for an interior design business offering sourcing, importing, installation, and architecture services.",
      },
      {
        name: "twitter:description",
        content:
          "Design Source Hub is a multi-page website for an interior design business offering sourcing, importing, installation, and architecture services.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/92261710-d2dd-48e2-b9b0-729556e7ea5c/id-preview-da35bdb4--d8da38ef-b03a-494e-893a-0ac2a3caa8de.lovable.app-1779217705762.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/92261710-d2dd-48e2-b9b0-729556e7ea5c/id-preview-da35bdb4--d8da38ef-b03a-494e-893a-0ac2a3caa8de.lovable.app-1779217705762.png",
      },
      { name: "description", content: "My GitHub Hub is a web application for managing website content and user roles." },
      { property: "og:description", content: "My GitHub Hub is a web application for managing website content and user roles." },
      { name: "twitter:description", content: "My GitHub Hub is a web application for managing website content and user roles." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/972f98fb-b093-4f1b-add0-ce1c73d12b88/id-preview-1a5608b9--a0274a24-b42f-4dde-b2c5-f147af7c8193.lovable.app-1779613218035.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/972f98fb-b093-4f1b-add0-ce1c73d12b88/id-preview-1a5608b9--a0274a24-b42f-4dde-b2c5-f147af7c8193.lovable.app-1779613218035.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Instrument+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
