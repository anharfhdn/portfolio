"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import {
  Cpu,
  Database,
  Network,
  Coins,
  Image as ImageIcon,
  Fuel,
  FileCode,
  Code,
  Cable,
  Workflow,
  Building2,
} from "lucide-react";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

export type TechIconOption = {
  key: string;
  label: string;
  Icon?: IconComponent;
  src?: string;
};

const LUCIDE_EXPLICITS: TechIconOption[] = [  { key: "database", label: "Database (generic)", Icon: Database },
  { key: "network", label: "Network / EVM", Icon: Network },
  { key: "cpu", label: "Chip / PLC", Icon: Cpu },
  { key: "coins", label: "DeFi", Icon: Coins },
  { key: "image", label: "NFT / Image", Icon: ImageIcon },
  { key: "fuel", label: "Gas", Icon: Fuel },
  { key: "filecode", label: "Smart Contract", Icon: FileCode },
  { key: "code", label: "Code (generic)", Icon: Code },
  { key: "cable", label: "Serial / Cable", Icon: Cable },
  { key: "workflow", label: "OPC UA", Icon: Workflow },
  { key: "building", label: "BACnet / Building", Icon: Building2 },
];

const BRAND_SLUGS: [string, string][] = [
  ["python", "Python"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["go", "Go"],
  ["rust", "Rust"],
  ["kotlin", "Kotlin"],
  ["swift", "Swift"],
  ["dart", "Dart"],
  ["java", "Java"],
  ["c", "C"],
  ["cplusplus", "C++"],
  ["csharp", "C#"],
  ["php", "PHP"],
  ["ruby", "Ruby"],
  ["scala", "Scala"],
  ["elixir", "Elixir"],
  ["clojure", "Clojure"],
  ["haskell", "Haskell"],
  ["lua", "Lua"],
  ["perl", "Perl"],
  ["r", "R"],
  ["julia", "Julia"],
  ["zig", "Zig"],
  ["gleam", "Gleam"],
  ["solidity", "Solidity"],
  ["ethereum", "Ethereum"],
  ["bitcoin", "Bitcoin"],
  ["solana", "Solana"],
  ["polygon", "Polygon"],
  ["ipfs", "IPFS"],
  ["filecoin", "Filecoin"],
  ["chainlink", "Chainlink"],
  ["metamask", "MetaMask"],
  ["react", "React"],
  ["nextdotjs", "Next.js"],
  ["vuedotjs", "Vue.js"],
  ["angular", "Angular"],
  ["svelte", "Svelte"],
  ["nuxtdotjs", "Nuxt.js"],
  ["astro", "Astro"],
  ["nodedotjs", "Node.js"],
  ["deno", "Deno"],
  ["express", "Express"],
  ["fastify", "Fastify"],
  ["nestjs", "NestJS"],
  ["django", "Django"],
  ["flask", "Flask"],
  ["fastapi", "FastAPI"],
  ["laravel", "Laravel"],
  ["codeigniter", "CodeIgniter"],
  ["spring", "Spring"],
  ["springboot", "Spring Boot"],
  ["rubyonrails", "Ruby on Rails"],
  ["tailwindcss", "Tailwind CSS"],
  ["bootstrap", "Bootstrap"],
  ["jquery", "jQuery"],
  ["vite", "Vite"],
  ["webpack", "Webpack"],
  ["babel", "Babel"],
  ["eslint", "ESLint"],
  ["prettier", "Prettier"],
  ["jest", "Jest"],
  ["cypress", "Cypress"],
  ["playwright", "Playwright"],
  ["selenium", "Selenium"],
  ["flutter", "Flutter"],
  ["android", "Android"],
  ["androidstudio", "Android Studio"],
  ["xcode", "Xcode"],
  ["ionic", "Ionic"],
  ["expo", "Expo"],
  ["postgresql", "PostgreSQL"],
  ["mysql", "MySQL"],
  ["mariadb", "MariaDB"],
  ["mongodb", "MongoDB"],
  ["redis", "Redis"],
  ["sqlite", "SQLite"],
  ["supabase", "Supabase"],
  ["firebase", "Firebase"],
  ["prisma", "Prisma"],
  ["elasticsearch", "Elasticsearch"],
  ["apachekafka", "Kafka"],
  ["rabbitmq", "RabbitMQ"],
  ["mqtt", "MQTT"],
  ["hivemq", "HiveMQ"],
  ["eclipsemosquitto", "Eclipse Mosquitto"],
  ["zigbee", "Zigbee"],
  ["zigbee2mqtt", "Zigbee2MQTT"],
  ["graphql", "GraphQL"],
  ["tensorflow", "TensorFlow"],
  ["pytorch", "PyTorch"],
  ["opencv", "OpenCV"],
  ["arduino", "Arduino"],
  ["espressif", "Espressif (ESP32)"],
  ["raspberrypi", "Raspberry Pi"],
  ["stmicroelectronics", "STMicroelectronics"],
  ["docker", "Docker"],
  ["kubernetes", "Kubernetes"],
  ["git", "Git"],
  ["github", "GitHub"],
  ["gitlab", "GitLab"],
  ["linux", "Linux"],
  ["ubuntu", "Ubuntu"],
  ["debian", "Debian"],
  ["apple", "Apple"],
  ["nginx", "Nginx"],
  ["jenkins", "Jenkins"],
  ["terraform", "Terraform"],
  ["ansible", "Ansible"],
  ["grafana", "Grafana"],
  ["prometheus", "Prometheus"],
  ["postman", "Postman"],
  ["figma", "Figma"],
  ["notion", "Notion"],
  ["slack", "Slack"],
  ["discord", "Discord"],
  ["jira", "Jira"],
  ["intellijidea", "IntelliJ IDEA"],
  ["npm", "npm"],
  ["pnpm", "pnpm"],
  ["yarn", "Yarn"],
];

export const TECH_ICON_OPTIONS: TechIconOption[] = [
  ...BRAND_SLUGS.map(([key, label]) => ({ key, label }) as TechIconOption),
  ...LUCIDE_EXPLICITS,
  {
    key: "microsoftsqlserver",
    label: "Microsoft SQL Server",
    src: "/icons/mssql.svg",
  },
  {
    key: "visualstudiocode",
    label: "VS Code",
    src: "/icons/vscode.svg",
  },
];

export function techIconSrc(slug: string): string {
  return `https://cdn.simpleicons.org/${slug}`;
}

export function TechIcon({
  icon,
  size = 28,
}: {
  icon?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) return null;
  const option = TECH_ICON_OPTIONS.find((o) => o.key === icon);
  if (option?.Icon) {
    const Lucide = option.Icon;
    // eslint-disable-next-line react-hooks/static-components -- selecting a registered component, not creating one
    return <Lucide size={size} />;
  }
  return (
    <img
      src={option?.src ?? techIconSrc(icon)}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function techIconLabel(key?: string): string {
  if (!key) return "None";
  return TECH_ICON_OPTIONS.find((o) => o.key === key)?.label ?? key;
}
