export type SiteSettings = {
  profile_name: string;
  meta_title: string;
  meta_description: string;
  availability_badge: string;
  contact_email: string;
  contact_intro: string;
  location_city: string;
  location_mode: string;
  focus_title: string;
  social_github: string;
  social_linkedin: string;
  social_instagram: string;
  blog_categories: string[];
  career_start: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_bio: string;
  about_title_line1: string;
  about_title_line2: string;
  about_bio: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  profile_name: "Anhar Fahrudin",
  meta_title: "Anhar F | Full-Stack | Web3",
  meta_description:
    "Engineering robust software at the intersection of Industrial Automation & Decentralized Protocols. Building reliable, scalable Web3 systems.",
  availability_badge:
    "🌏 Open to Remote/Onsite • Full-Stack + Blockchain Developer",
  contact_email: "anharfahrudin21@gmail.com",
  contact_intro:
    "Always looking for challenges in <strong>Industrial IoT architecture</strong> or collaborating on <strong>Web3 protocols</strong>. Based in Indonesia, working worldwide.",
  location_city: "Bogor, ID",
  location_mode: "Remote / Onsite",
  focus_title: "Web3 & Industrial IoT",
  social_github: "https://github.com/anharfhdn",
  social_linkedin: "https://www.linkedin.com/in/anhar-fahrudin/",
  social_instagram: "https://www.instagram.com/anharfhdn",
  blog_categories: [
    "Web Development",
    "Blockchain",
    "DeFi",
    "NFT",
    "Smart Contracts",
    "Tutorial",
    "News",
    "Opinion",
    "Books",
    "Life",
  ],
  career_start: "2023-01",
  hero_title_line1: "ENGINEERING",
  hero_title_line2: "REAL-WORLD SYSTEMS",
  hero_bio:
    "<strong>Full-Stack Software Engineer</strong> with <strong>{{years}}</strong> of experience building production-grade<br><strong>industrial automation, IoT, and data-driven</strong> application systems.<br><br>Currently advancing the <strong>Web3 ecosystem</strong>—engineering decentralized solutions across<br><strong>DeFi, NFTs, and RWA</strong>. Specializing in<strong> asset tokenization</strong> and <strong>Smart Contract architecture</strong> (Solidity, Rust, EVM) to build a more transparent, <strong>decentralized future</strong>.",
  about_title_line1: "BRIDGING SYSTEMS",
  about_title_line2: "WITH CODE",
  about_bio:
    "Engineering robust software at the intersection of <strong>Industrial Automation</strong> and <strong>Decentralized Protocols</strong>. Focused on creating systems where reliability and data integrity are non-negotiable.<br><br>Leveraging <strong>{{years}}</strong> of full-stack experience to build applications that translate complex industrial requirements into elegant, scalable technical solutions.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch("/api/settings", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch settings (GET /api/settings → ${res.status}):`,
        await res.text(),
      );
      return DEFAULT_SETTINGS;
    }

    const data = await res.json();
    const rows = (data.data ?? {}) as Record<string, any>;
    return {
      ...DEFAULT_SETTINGS,
      ...Object.fromEntries(
        Object.entries(rows).filter(([, v]) => v !== null && v !== undefined),
      ),
    } as SiteSettings;
  } catch (err) {
    console.error("Error getting settings:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(
  settings: Partial<SiteSettings>,
): Promise<boolean> {
  try {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: Object.entries(settings).map(([key, value]) => ({
          key,
          value,
        })),
      }),
    });

    if (!res.ok) {
      console.error("Failed to save settings via API:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error saving settings:", err);
    return false;
  }
}
