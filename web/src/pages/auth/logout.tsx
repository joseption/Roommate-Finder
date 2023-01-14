import { useRouter } from "next/router";

import { clearAuthSession } from "../../utils/storage";

export default function Logout() {
  const router = useRouter();
  // clearAuthSession();
  //TODO - need to call server to delete tokens.
  void router.push("/auth");
  return null;
}

//
