// Links that change when the project moves. Everything outward-facing reads from here.
export const site = {
  name: "HieraticBench",
  version: "v0.1",
  url: "https://hieraticbench.com",
  github: "https://github.com/alymoursy/hieraticbench",
  email: "aly@veeza.ai",
  founder: "Aly Moursy",
};

export const mailto = (subject: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`HieraticBench: ${subject}`)}`;
