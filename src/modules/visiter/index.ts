import ts from "typescript";
import {
  isFunctionalComponent1,
  isFunctionalComponent2,
} from "./component_assertion.js";

export const findComponentName = (
  filePath: string,
  fileContent: string,
): string => {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );
  const name = visit(sourceFile);

  if (!name) throw new Error(`Could not find component '${filePath}'`);
  return name;
};

const visit = (node: ts.Node): undefined | string => {
  const isComponent = (
    node: ts.Node,
  ): node is ts.Node & { name?: ts.Identifier } =>
    isFunctionalComponent1(node) || isFunctionalComponent2(node);

  if (isComponent(node) && node.name && ts.isIdentifier(node.name))
    return node.name.text;

  return ts.forEachChild(node, visit);
};
