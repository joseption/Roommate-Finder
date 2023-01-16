import { ReactNode } from "react";

import UseAuthRedirect from "../hooks/useAuthRedirect";

interface Props {
  children: ReactNode;
}

export default function AuthRedirectWrapper({ children }: Props) {
  UseAuthRedirect();

  return <>{children}</>;
}
