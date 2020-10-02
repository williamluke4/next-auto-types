import path from 'path';
import { SourceFile } from 'ts-morph';
import { NextFunctions, NextFunctionType } from './constants';

export function isJS(sourceFile: SourceFile){
  const filePath = sourceFile.getFilePath()
  const extension = path.extname(filePath)
  return extension.includes('js')
}

export function getUsedNextFunctions(
  sourceFile: SourceFile
): NextFunctionType {
  const exports = sourceFile.getSymbol().getExports();
  const foundFunctions = {};
  exports.forEach((e) => {
    const name = e.getName();
    if (Object.keys(NextFunctions).includes(name)) {
      foundFunctions[name] = NextFunctions[name];
      // console.log(e.getValueDeclaration());
    }
  });
  return foundFunctions;
}