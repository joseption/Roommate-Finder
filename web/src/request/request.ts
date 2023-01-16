/**
 * Calls the fetch API with authorization and the passed parameters. If the response is not ok, it will throw an error.
 *
 * @param url - The URL to call (e.g. /api/user/login)
 * @param body - The body of the request
 * @param method - The HTTP method to use (e.g. POST)
 *
 * @returns The response from the API
 */
import UseAuthRedirect from "../hooks/useAuthRedirect";
import { getAuthSession } from "../utils/storage";

export default async function doRequest<R>(
  url: string,
  body: any,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  RefreshAuth: boolean
): Promise<R> {
  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getAuthSession().accessToken || "NONE"}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    // try to parse for an error
    const data = (await res.json().catch(() => null)) as {
      Error: string;
    } | null;
    if (res.status === 401 && RefreshAuth) {
      // call auth hook to refresh token
      UseAuthRedirect();
    }
    throw new Error(data?.Error ?? "Unknown server error", {
      cause: { code: res.status },
    });
  }

  return (await res.json()) as R;
}
