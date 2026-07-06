import Image from "next/image";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="inline-flex items-center gap-2 font-semibold">
        <Image
          src="/logo-mark.svg"
          alt=""
          width={22}
          height={22}
          className="size-[22px] dark:invert"
        />
        onchain-ui
      </span>
    ),
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "GitHub",
      url: "https://github.com/GavinJaynes/onchain-ui",
    },
  ],
};
