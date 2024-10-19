const main = async () => {
  const hmrCode = await Deno.readTextFile(
    new URL(`${import.meta.url}/src/hmr/index.html`).href
  );

  console.log(hmrCode);
};

if (import.meta.main) {
  main();
}
