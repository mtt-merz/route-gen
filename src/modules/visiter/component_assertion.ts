import ts from "typescript";

const hasExportModifier = (
  node: ts.Node & { modifiers?: ts.NodeArray<ts.ModifierLike> },
): boolean =>
  (node.modifiers ?? []).some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );

/**
 * Case 1: detect components declared as
 * export function Component(...) { ... return <>test</> }
 *
 * The AST node is
 *   FunctionDeclaration
 *    Identifier *
 *    ...
 *    Block
 *      ReturnStatement
 *        JsxElement
 *          ...
 *
 * @param node is the node to check
 * @returns true if the node is a functional component
 */
export const isFunctionalComponent1 = (
  node: ts.Node,
): node is ts.FunctionDeclaration => {
  if (ts.isFunctionDeclaration(node) && hasExportModifier(node)) {
    for (const statement of node.body?.statements ?? []) {
      if (
        ts.isReturnStatement(statement) &&
        statement.expression &&
        ts.isJsxExpression(statement.expression)
      ) {
        return true;
      }
    }

    console.log("Exported function found, but not returning a jsx element");
  }

  return false;
};

/**
 * Case 2: detect components declared as
 * export const Component = (...) => <>test</>
 *
 * The AST node is
 *   VariableDeclaration
 *    Identifier *
 *    ArrowFunction
 *      ...
 *      JsxElement
 *        ...
 *
 */
export const isFunctionalComponent2 = (
  node: ts.Node,
): node is ts.VariableDeclaration => {
  if (
    ts.isVariableDeclaration(node) &&
    hasExportModifier(node) &&
    node.initializer &&
    ts.isArrowFunction(node.initializer)
  ) {
    if (node.initializer.body && ts.isJsxElement(node.initializer.body))
      return true;

    console.log(
      "Exported arrow function found, but not returning a jsx element",
    );
  }
  return false;
};
