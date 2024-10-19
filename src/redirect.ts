export const redirect = (url: string) => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};
