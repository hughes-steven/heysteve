# heysteve.ca — Website Brief & Brand Guide

## Overview

Personal consulting website for Steven Hughes, a manufacturing automation consultant based in Waterloo, Ontario. Steven trains manufacturing teams to build their own custom software using modern AI-powered development tools.

**Domain:** heysteve.ca
**Purpose:** Single-page landing site that establishes credibility, communicates the offer, and drives inbound conversations via LinkedIn or a contact form.
**Audience:** Canadian manufacturing owners, ops managers, and plant managers at SMEs (20–200 employees, $5M–$50M revenue). Think CNC shops, metal fabricators, plastics/injection molding, food processing, packaging, wood products, contract manufacturers.

---

## Brand Tagline

**"I train manufacturing teams to build their own software. It's yours to host, modify, and sell."**

---

## Design Direction: Monospaced Resume Vibe

### Aesthetic
- **Tone:** Clean, technical, plaintext, document-like. Think résumé printed on good paper, or a well-formatted README. Not flashy. Not startup-y. Not "AI slop."
- **Font:** Monospaced throughout — JetBrains Mono is the primary choice. Use weight variations (400, 500, 700, 800) for hierarchy instead of switching font families.
- **Color palette:**
  - Background: warm off-white `#faf9f7` (like paper)
  - Primary text: near-black `#1a1a1a`
  - Secondary text: `#555555`
  - Muted/labels: `#999999`
  - Accent: use sparingly — inverted blocks (black background, white text) for emphasis rather than color
- **Layout:** Generous whitespace. Left-aligned. Thin horizontal rules as section dividers. No cards, no rounded corners, no gradients, no shadows. Content breathes.
- **Formatting cues:** Use `//` comment-style labels for section headers (e.g., `// WHAT I DO`). Use inverted highlight spans for key phrases. Use bordered pill/box elements for the three pillars (Host / Modify / Sell).
- **No imagery.** No stock photos. No icons. No illustrations. Text and whitespace only. The design IS the content.
- **Responsive:** Must work on mobile. The monospaced aesthetic actually scales down well — just reduce font sizes and padding.

### What to avoid
- Gradient backgrounds
- Hero images or stock photography
- Rounded buttons with hover color transitions
- Sans-serif body fonts
- Anything that looks like a SaaS landing page
- Emoji in the body content
- Testimonial carousels
- Animated counters or statistics

---

## Page Structure

### Section 1: Header
```
// STEVEN HUGHES
// WATERLOO, ONTARIO

I train manufacturing teams
to build [their own software.]    ← inverted highlight

It's yours to host, modify, and sell.
```

Keep it stark. The tagline IS the hero. No subtitle needed. No "welcome to my site."

---

### Section 2: The Problem
```
// THE PROBLEM
```

Content (write in plain, direct prose — not bullet points):

Every manufacturer has the same story. There's a process running on spreadsheets, whiteboards, and tribal knowledge. Off-the-shelf software does 70% of what they need at 200% of what they should pay. Dev shops want six figures and six months. So nothing changes. The spreadsheet stays. The workaround stays. The frustration stays.

---

### Section 3: The Shift
```
// WHAT CHANGED
```

Content:

We're past "vibe coding" — the era of asking AI to write code and hoping for the best. That produced fragile tools that broke the moment you changed anything.

We're now in the era of Agentic Engineering. AI development tools plan, architect, test, debug, and iterate. They follow engineering best practices. They produce documented, maintainable, production-grade software. And they get dramatically better every month.

This means your process engineer, your ops manager, your quality lead — with the right guidance, they can build real software. Not a toy. Not a prototype. Working tools your business runs on.

---

### Section 4: What I Do
```
// WHAT I DO
```

Content:

You've been thinking about a tool that would change how your shop runs. A quoting system. A scheduling board. A quality tracker. A production dashboard. You've been sketching it for years.

I come in for 8 weeks. We build it together. I train your team to understand, maintain, and improve it. Then I hand you the keys.

**Key details (formatted as a clean list or grid):**
- 8 weeks. Fixed price.
- $20K – $50K depending on scope.
- Your team is involved from day one.
- Full documentation and training included.
- You own every line of code.

---

### Section 5: The Three Freedoms
```
// IT'S YOURS
```

Display the three pillars prominently, using bordered boxes similar to the LinkedIn post design:

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│   HOST   │ │  MODIFY  │ │   SELL   │
└──────────┘ └──────────┘ └──────────┘
```

Under each:

**HOST** — Run it on your own network. Your data stays in your building. No cloud subscription that doubles in price. Works even when your internet doesn't.

**MODIFY** — Your team understands the code. Change it when your process changes. No calling a contractor for every small tweak. It grows with your business.

**SELL** — You solved a problem other shops have too. License it. Sell it. That $30K project just became a business asset, not a line item.

---

### Section 6: Who This Is For
```
// WHO THIS IS FOR
```

Content:

Canadian manufacturers with 20–200 employees who are stuck between spreadsheets and six-figure enterprise software. CNC shops. Metal fabricators. Plastics and injection molding. Food processing. Packaging. Wood products. Contract manufacturers.

If your team has been maintaining a nightmare Excel file for years and you've been thinking "there has to be a better way" — there is now.

---

### Section 7: About
```
// ABOUT
```

Content:

Steven Hughes. Waterloo, Ontario. Background spanning factory automation, software development, and AI. I've worked on production floors and in codebases. I speak both languages.

I'm not a dev shop. I'm not an agency. I'm one person who understands manufacturing and software, and I teach your team to bridge the gap permanently.

---

### Section 8: Contact / CTA
```
// LET'S TALK
```

Keep it simple:

If you've been sitting on an idea for a tool that would change how your operation runs — now is the time.

**LinkedIn:** linkedin.com/in/steven-hughes-consulting
**Email:** [steven's email — placeholder]

No contact form necessary for v1. LinkedIn DM and email are the conversion paths. Manufacturing buyers want a conversation, not a form submission.

---

## Technical Notes for Claude Code

- **Single page, static HTML + CSS.** No framework needed. No JavaScript required unless adding a subtle scroll animation.
- **Host on Cloudflare Pages** or similar static host.
- **Performance:** Should score 95+ on Lighthouse. It's a text page — keep it fast.
- **SEO basics:** Title tag: "Steven Hughes — I train manufacturing teams to build their own software" / Meta description using the tagline. Open Graph tags for LinkedIn sharing.
- **Favicon:** Simple monospaced "SH" or "S" in black on transparent background, generated as SVG.
- **Print stylesheet:** Optional but on-brand — this page should look good printed. That's the resume vibe.
- **Dark mode:** Not required for v1, but if implemented, invert to dark background `#0a0a0a` with light text `#e8e8e8`, same monospaced aesthetic.

---

## Content for LinkedIn (Reference)

### Post 1: Brand Announcement (pair with image)
Use the image we designed — monospaced, black-on-cream, with the tagline and HOST / MODIFY / SELL pillars.

### Post 2: Educational (Agentic Engineering explainer)

"Your team can't build software. They're not developers."

I hear this every time. And a year ago, it was true.

But things have changed. Fast.

You may have heard of "vibe coding" — telling an AI to write code and hoping for the best. That was the early experiment. It was messy. It produced fragile tools that broke the moment you tried to change anything. Fair enough — that wasn't ready for a production environment.

We're past that now.

We're in the era of Agentic Engineering. AI development tools don't just write code anymore — they plan, architect, test, debug, and iterate. They follow engineering best practices. They produce documented, maintainable, production-grade software.

And they get better every month. Not a little better. Dramatically better.

What this means for your manufacturing team:

Your process engineer who's been maintaining that nightmare Excel quoting spreadsheet for six years? With the right guidance, they can now build a real application that replaces it. Not a toy. Not a prototype. Working software.

Your ops manager who's been sketching a scheduling tool on a whiteboard for three years? They can build it.

They're not becoming software engineers. They don't need to. They need someone who understands both manufacturing and software to guide them through the process — to set up the right tools, make the right architectural decisions, and teach them how to maintain and improve what they've built.

That's what I do.

I train manufacturing teams to build their own software. It's yours to host, modify, and sell.

8 weeks. Fixed price. Your team walks away with a working tool and the skills to keep building.

The gap between "idea" and "working software" has never been smaller. And it's shrinking every month.

If you've been sitting on an idea for years — now is the time.

---

## Five Core Advantages (Reference)

1. **Custom software they own** — Full IP transfer. No subscriptions. No vendor lock-in. The software is a company asset, not a recurring expense.

2. **They already have the dream** — The people closest to the problem already know the solution. They've been sketching it for years. This isn't "tell us your requirements so we can interpret them." This is "you know what you need — let's build it."

3. **Training and knowledge transfer** — The real deliverable isn't code. It's the fact that the team now has a permanent capability. Documentation in plain language. Training for 1–2 team members. Code structured so common changes are configuration, not deep modifications.

4. **Self-hosting** — Data stays on their network. Works offline. No cloud subscription. Especially important for ITAR, defense supply chain, proprietary process data, or general distrust of cloud vendors. Deploy on a simple server or NUC running Docker.

5. **They can sell it** — If the tool solves a problem other shops have, they can license or sell it. The $30K project becomes a potential revenue stream. Reframes the investment from cost to asset.

---

## Competitive Positioning (Reference)

The custom software market in Canada is dominated by 5–200 person dev shops (Whitecap, Innofast, Mantrax, Belitsoft, Codepaper) who all offer IP ownership but charge $100K–$500K+ for 6–12 month engagements targeting enterprise clients.

Nobody is occupying this lane: a solo consultant with deep manufacturing domain knowledge, doing focused 8-week builds at $20K–$50K, with hands-on training and full handoff. The combination of manufacturing floor experience + software development + AI enablement + teach-and-leave model is unique.

The Upwork/freelancer market is flooded with people selling Zapier/n8n/Make workflows as "automation." Steven builds actual software — that distinction matters to manufacturing buyers who need durable, self-hosted tools.

---

## Key Messaging Hierarchy

1. **Hook:** "You've been thinking about this tool for years."
2. **Promise:** "I train manufacturing teams to build their own software. It's yours to host, modify, and sell."
3. **Proof:** Case studies of teams enabled (to be added as they come).
4. **Close:** "8 weeks. Fixed price. You keep everything — the software, the skills, and the independence."
