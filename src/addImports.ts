import { SourceFile } from "ts-morph";
import { NextFunctions, NextFunctionType } from "./constants";
/**
 * Adds Missing Next Imports depending on the exports
 * as next requires `getStaticProps` and `getServerSideProps`
 * to be exported
 * @param sourceFile
 */
export function addMissingImports(
  sourceFile: SourceFile
): NextFunctionType {
  const exports = sourceFile.getSymbol().getExports();
  const foundFunctions = {};
  exports.forEach((e) => {
    const name = e.getName();
    if (Object.keys(NextFunctions).includes(name)) {
      const typeToImport = NextFunctions[name].import;
      addImportIfMissing(sourceFile, typeToImport);
      foundFunctions[name] = NextFunctions[name];
      // console.log(e.getValueDeclaration());
    }
  });
  return foundFunctions;
}

export function addImportIfMissing(sourceFile: SourceFile, type) {
  // import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
  let nextImport = sourceFile.getImportDeclaration("next");
  let hasTypeImport = false;
  if (!nextImport) {
    nextImport = sourceFile.addImportDeclaration({
      moduleSpecifier: "next",
      namedImports: [type],
    });
  } else {
    const namedImports = nextImport.getNamedImports();
    hasTypeImport = namedImports.map((is) => is.getText()).includes(type);
    if (!hasTypeImport) {
      nextImport.addNamedImport(type);
    }
  }
}
