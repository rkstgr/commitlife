import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.authenticate(params.provider!, request);

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  session.set("user", user);

  throw redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
