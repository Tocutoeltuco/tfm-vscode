import { promises as fsp } from "fs";
import { LuaHelpMainDocument } from "./luahelp-main";
import { LuaHelpDocumentModes } from "./LuaHelpDocument";

function generate(luaHelpBuf: string) {
  const doc = new LuaHelpMainDocument(luaHelpBuf);
  doc.parse();
  return doc.exportSumnekoLua();
}

async function write(mode: LuaHelpDocumentModes, lines: string[]) {
  await fsp.writeFile(
    `luaLib/library/tfm.${mode}.lua`,
    "--- @meta\n" +
      "-- !! This file is generated by an NPM script. !!\n\n" +
      lines.join("\n")
  );
}

(async () => {
  console.log("Generating output...");
  const outputs = generate((await fsp.readFile("./luahelp.txt")).toString());
  console.log("Generated.");
  for (const mode of Object.keys(outputs)) {
    write(mode as LuaHelpDocumentModes, outputs[mode]);
  }
  console.log("Wrote output to file.");
})();
