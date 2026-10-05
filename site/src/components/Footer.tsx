import { Container } from "@/components/Container";
import { mailto, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5 py-12">
      <Container className="flex flex-col justify-between gap-6 text-base text-stone-600 sm:flex-row sm:text-sm">
        <p className="max-w-[56ch] text-pretty">
          {site.name} was started by {site.founder}, founder of{" "}
          <a href={site.company.url} className="underline decoration-stone-300 hover:decoration-rubric">
            {site.company.name}
          </a>
          , in 2026. Code is MIT licensed and results are CC BY 4.0. Every image is credited on the{" "}
          <a href="/dataset/" className="underline decoration-stone-300 hover:decoration-rubric">
            dataset page
          </a>
          .
        </p>
        <ul role="list" className="flex shrink-0 gap-6">
          <li>
            <a href={site.github} className="hover:text-ink">
              GitHub
            </a>
          </li>
          <li>
            <a href="/method/" className="hover:text-ink">
              Method
            </a>
          </li>
          <li>
            <a href={mailto("Hello")} className="hover:text-ink">
              Contact
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
