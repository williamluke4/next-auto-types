import {
  ArrowFunction,
  FunctionDeclaration,
  SourceFile,
  TypeGuards,
} from "ts-morph";
import { NextFunctionName, NextFunctionType } from "./constants";

function addType(node: ArrowFunction | FunctionDeclaration, allTypes: string) {
  const params = node.getParameters();
  const param = params[0];
  if (param) {
    node.addParameter({
      name: param.getName(),
      type: allTypes,
    });
    param.remove();
  } else {
    node.addParameter({
      name: "props",
      type: allTypes,
    });
  }
}

export function addTypesToPage(
  sourceFile: SourceFile,
  foundNextFunctions: NextFunctionType
) {
  const defaultExportSymbol = sourceFile.getDefaultExportSymbol();
  const allTypes = Object.keys(foundNextFunctions).reduce(
    (acc, functionName) => {
      const type = foundNextFunctions[functionName as NextFunctionName].type;
      if (acc) {
        acc += ` & ${type}`;
      } else {
        acc = type;
      }
      return acc;
    },
    ""
  );
  if (defaultExportSymbol) {
    // you will need to handle more scenarios than what's shown here
    const declaration = defaultExportSymbol.getDeclarations()[0];
    if (!declaration) return;

    if (TypeGuards.isFunctionDeclaration(declaration)) {
      addType(declaration, allTypes);
    } else if (TypeGuards.isExportAssignment(declaration)) {
      const expr = declaration.getExpression();

      if (TypeGuards.isArrowFunction(expr)) {
        addType(expr, allTypes);
      } else if (TypeGuards.isIdentifier(expr)) {
        const node = expr
          .findReferences()[0]
          .getDefinition()
          .getDeclarationNode();
        const child =  node.getLastChild()

        if (TypeGuards.isFunctionDeclaration(node) || TypeGuards.isArrowFunction(node)) {
          addType(node, allTypes);
        } else if (
          TypeGuards.isArrowFunction(child) ||
          TypeGuards.isFunctionDeclaration(child)
        ) {
          addType(child, allTypes);
        } else {
          console.log("Unhandled Case 1", child.getKindName());
        }
      } else {
        console.log("Unhandled Case 2", expr.getKindName());
      }
    } else {
      console.log("Unhandled Case 3", declaration.getKindName());
    }
  }
}
