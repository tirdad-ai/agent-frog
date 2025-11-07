import { routing } from "@repo/i18n/routing";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Since users might visit the root URL, we need to redirect to the default locale
// This layout should not render anything visible, just handle locale redirection
export default function RootLayout({ children }: Props) {
  return children;
}
