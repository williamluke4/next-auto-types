import { SourceFile } from "ts-morph";
import { NextFunctionName, NextFunctions, NextFunctionType } from "./constants";

/**
 * Adds Missing Next Imports depending function which have been found
 */
export function addMissingImports(
  sourceFile: SourceFile,
  foundNextFunctions: NextFunctionType
) {
  Object.keys(foundNextFunctions).forEach((functionName: NextFunctionName) => {
    addImportIfMissing(sourceFile, foundNextFunctions[functionName].import);
  })
}

export function addImportIfMissing(sourceFile: SourceFile, type: string) {
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
