import LoginForm from "../_components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const requestedCallbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;

  const callbackUrl =
    requestedCallbackUrl?.startsWith("/") &&
    !requestedCallbackUrl.startsWith("//") &&
    !requestedCallbackUrl.includes("\\")
      ? requestedCallbackUrl
      : "/menu";

  return <LoginForm callbackUrl={callbackUrl} />;
}
