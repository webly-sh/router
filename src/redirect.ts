export const redirect = (url: string): Response => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
};
