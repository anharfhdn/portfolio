export interface BlogPost {
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
    author: string;
    readTime: string;
    category: string;
    image: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        title: "Mastering Next.js 15 and Turbopack",
        slug: "mastering-nextjs-15",
        date: "Jan 20, 2026",
        excerpt: "Explore the latest features of Next.js 15, including enhanced performance with Turbopack and the new cache API.",
        content: `
      <h2>The Future of Web Development</h2>
      <p>Next.js 15 introduces several game-changing features that streamline the development process and improve end-user performance. One of the most significant additions is the stable release of Turbopack, which offers lightning-fast HMR and build times.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Stable Turbopack for local development</li>
        <li>Improved caching strategies</li>
        <li>Enhanced partial prerendering</li>
        <li>React 19 support</li>
      </ul>

      <p>In this post, we'll dive deep into how you can migrate your existing projects and leverage these new tools to build better software.</p>
    `,
        author: "Jane Doe",
        readTime: "5 min read",
        category: "Development",
        image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1000&auto=format&fit=crop",
    },
    {
        title: "Why Minimalist Design Wins in 2026",
        slug: "minimalist-design-2026",
        date: "Jan 15, 2026",
        excerpt: "Minimalism isn't just an aesthetic choice anymore; it's a performance and usability necessity for modern web apps.",
        content: `
      <h2>Less is More</h2>
      <p>As web applications become more complex, users are increasingly drawn to interfaces that are simple, clear, and direct. Minimalist design focuses on the essentials, reducing cognitive load and improving focus.</p>

      <h3>Core Principles</h3>
      <p>1. Purposeful Whitespace: Give your content room to breathe.</p>
      <p>2. Typography-driven UI: Let the fonts do the heavy lifting.</p>
      <p>3. Limited Color Palette: Use color to guide action, not distract.</p>

      <p>By following these principles, you can create experiences that feel both premium and approachable.</p>
    `,
        author: "Jane Doe",
        readTime: "4 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop",
    },
];
