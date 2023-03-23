import { useRouter } from "next/router";
import { ReactNode } from "react";

import UseAuthRedirect from "../hooks/useAuthRedirect";
interface Props {
  children: ReactNode;
}

export default function AuthRedirectWrapper({ children }: Props) {
  const router = useRouter();
  if (router.pathname !== "/") {
    UseAuthRedirect();
  }
  return <>{children}</>;
}
