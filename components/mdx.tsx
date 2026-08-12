import type { ReactNode } from "react";
import { Callout } from "fumadocs-ui/components/callout";
import { Card as FumaCard, Cards } from "fumadocs-ui/components/card";
import { Step as FumaStep, Steps } from "fumadocs-ui/components/steps";
import {
  AppWindow,
  ArrowUpDown,
  ArrowUpRight,
  Boxes,
  ChartLine,
  Coins,
  CreditCard,
  FileSignature,
  FileText,
  Gift,
  Image,
  LayoutList,
  Mail,
  Minus,
  Package,
  Paintbrush,
  Pilcrow,
  Receipt,
  Repeat,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  SquareArrowUpRight,
  Tag,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";

/**
 * Mintlify-compatible MDX components implemented on fumadocs-ui primitives,
 * so the content written for the old Mintlify site works unchanged.
 * Icon names are the Font Awesome names Mintlify used, mapped to Lucide.
 */

const icons: Record<string, LucideIcon> = {
  "arrow-up-right": ArrowUpRight,
  "arrows-up-down": ArrowUpDown,
  "bag-shopping": ShoppingBag,
  "basket-shopping": ShoppingBasket,
  box: Package,
  "boxes-stacked": Boxes,
  "cart-shopping": ShoppingCart,
  "chart-line": ChartLine,
  coins: Coins,
  "credit-card": CreditCard,
  envelope: Mail,
  "file-contract": FileSignature,
  "file-lines": FileText,
  gear: Settings,
  gift: Gift,
  image: Image,
  minus: Minus,
  paintbrush: Paintbrush,
  paragraph: Pilcrow,
  receipt: Receipt,
  "rectangle-list": LayoutList,
  rotate: Repeat,
  "share-nodes": Share2,
  "shield-check": ShieldCheck,
  "square-arrow-up-right": SquareArrowUpRight,
  tag: Tag,
  truck: Truck,
  user: User,
  window: AppWindow,
};

export function Note({ children }: { children?: ReactNode }) {
  return <Callout type="info">{children}</Callout>;
}

export function Warning({ children }: { children?: ReactNode }) {
  return <Callout type="warn">{children}</Callout>;
}

export function Tip({ children }: { children?: ReactNode }) {
  return <Callout type="idea">{children}</Callout>;
}

export function Card({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon?: string;
  href?: string;
  children?: ReactNode;
}) {
  const Icon = icon ? icons[icon] : undefined;
  return (
    <FumaCard title={title} href={href} icon={Icon ? <Icon /> : undefined}>
      {children}
    </FumaCard>
  );
}

export function Columns({
  cols = 2,
  children,
}: {
  cols?: number;
  children?: ReactNode;
}) {
  return (
    <Cards className={cols >= 3 ? "lg:grid-cols-3" : undefined}>
      {children}
    </Cards>
  );
}

export function Step({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <FumaStep>
      {title ? <h3>{title}</h3> : null}
      {children}
    </FumaStep>
  );
}

export const mdxComponents = {
  Note,
  Warning,
  Tip,
  Card,
  Cards,
  Columns,
  Steps,
  Step,
  Callout,
};
