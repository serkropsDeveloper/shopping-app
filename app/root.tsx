import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { SpeedInsights } from "@vercel/speed-insights/remix";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SpeedInsights />
        <nav className="p-3 flex justify-center items-center gap-1 bg-slate-100">
          <Link
            to="/"
            prefetch="intent"
            className={`text-xl font-semibold p-2 rounded-xl duration-500 ease-in-out border-2 border-cyan-600 ${
              currentPath === "/" ? "bg-cyan-600/50" : "bg-cyan-500/30"
            }`}
          >
            Создать
          </Link>
          <Link
            to="/list"
            prefetch="intent"
            className={`text-xl font-semibold p-2 rounded-xl duration-500 ease-in-out border-2 border-cyan-600 ${
              currentPath === "/list" ? "bg-cyan-600/50" : "bg-cyan-500/30"
            }`}
          >
            Список
          </Link>
          <Link
            to="/history"
            prefetch="intent"
            className={`text-xl font-semibold p-2 rounded-xl duration-500 ease-in-out border-2 border-cyan-600 ${
              currentPath === "/history" ? "bg-cyan-600/50" : "bg-cyan-500/30"
            }`}
          >
            История
          </Link>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
