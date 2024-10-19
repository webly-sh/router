import type { JSX } from "react";

export const renderLayout = (layouts: JSX.Element[], response: JSX.Element) => {
  if (layouts.length === 1) {
    const Layout = layouts[0];
    return <Layout>{response}</Layout>;
  }

  const [Layout, ...rest] = layouts;

  if (rest.length === 0) {
    return <Layout>{response}</Layout>;
  }

  return <Layout>{renderLayout(rest, response)}</Layout>;
};
