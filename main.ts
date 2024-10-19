import { hmrScript } from "@/hmr/index.ts";

const main = async () => {
  console.log(hmrScript);
};

if (import.meta.main) {
  main();
}
