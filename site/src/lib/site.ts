// Links that change when the project moves. Everything outward-facing reads from here.
export const site = {
  name: "HieraticBench",
  version: "v0.1",
  url: "https://hieraticbench.vercel.app",
  github: "https://github.com/alymoursy/hieraticbench",
  email: "hieraticbench@veeza.ai",
  founder: "Aly Moursy",
  company: { name: "Veeza AI", url: "https://veeza.ai", batch: "YC F26" },
};

export const mailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`HieraticBench: ${subject}`)}`;
