const main = async () => {
  const hmrCode = await Deno.readTextFile(
    `${import.meta.dirname}/src/hmr/index.html`
  );

  console.log(hmrCode);
};

if (import.meta.main) {
  main();
}
