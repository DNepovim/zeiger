import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Ensure zeiger hook dependency arrays are not empty and all dependencies are used',
    },
    messages: {
      emptyDeps:
        'Zeiger hook dependency array must not be empty. Provide at least one property.',
      unusedDep:
        "Property '{{property}}' is listed in dependency array but not used in the code.",
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function isZeigerHookCall(node: Rule.Node): boolean {
      if (node.type !== 'CallExpression') {
        return false;
      }

      const callNode = node as Rule.Node & {
        type: 'CallExpression';
        callee: Rule.Node;
        arguments: Rule.Node[];
      };
      const callee = callNode.callee;

      if (callee.type !== 'Identifier') {
        return false;
      }

      const hookName = (
        callee as Rule.Node & { type: 'Identifier'; name: string }
      ).name;
      if (!hookName.startsWith('use')) {
        return false;
      }

      const args = callNode.arguments;
      if (args.length === 0) {
        return false;
      }

      const lastArg = args[args.length - 1];
      if (lastArg.type !== 'ArrayExpression') {
        return false;
      }

      const scope = sourceCode.getScope(node);
      const variable = scope.variables.find(
        (v: { name: string }) => v.name === hookName
      );

      if (!variable) {
        return false;
      }

      for (const def of variable.defs) {
        if (def.type === 'Variable' && def.node.init) {
          const init = def.node.init;
          if (init.type === 'CallExpression') {
            const initCall = init as Rule.Node & {
              type: 'CallExpression';
              callee: Rule.Node;
            };
            const initCallee = initCall.callee;

            if (initCallee.type === 'Identifier') {
              const initName = (
                initCallee as Rule.Node & {
                  type: 'Identifier';
                  name: string;
                }
              ).name;
              if (
                initName === 'createCollectionPointer' ||
                initName === 'createCollectionItemPointer'
              ) {
                return true;
              }
            }

            if (initCallee.type === 'MemberExpression') {
              const member = initCallee as Rule.Node & {
                type: 'MemberExpression';
                property: Rule.Node;
              };
              if (
                member.property.type === 'Identifier' &&
                ((
                  member.property as Rule.Node & {
                    type: 'Identifier';
                    name: string;
                  }
                ).name === 'createCollectionPointer' ||
                  (
                    member.property as Rule.Node & {
                      type: 'Identifier';
                      name: string;
                    }
                  ).name === 'createCollectionItemPointer')
              ) {
                return true;
              }
            }
          }
        }

        if (def.type === 'ImportBinding') {
          return true;
        }
      }

      return false;
    }

    function getDependencyArray(node: Rule.Node): string[] | null {
      if (node.type !== 'CallExpression') {
        return null;
      }

      const callNode = node as Rule.Node & {
        type: 'CallExpression';
        arguments: Rule.Node[];
      };
      const args = callNode.arguments;

      if (args.length === 0) {
        return null;
      }

      let depsArg: Rule.Node | null = null;

      if (args.length === 1) {
        depsArg = args[0];
      } else if (args.length === 2) {
        depsArg = args[1];
      }

      if (!depsArg || depsArg.type !== 'ArrayExpression') {
        return null;
      }

      const arrayNode = depsArg as Rule.Node & {
        type: 'ArrayExpression';
        elements: (Rule.Node | null)[];
      };
      const deps: string[] = [];

      for (const element of arrayNode.elements) {
        if (
          element &&
          element.type === 'Literal' &&
          typeof (element as Rule.Node & { type: 'Literal'; value: unknown })
            .value === 'string'
        ) {
          deps.push(
            (element as Rule.Node & { type: 'Literal'; value: string }).value
          );
        }
      }

      return deps;
    }

    function getUsedProperties(
      node: Rule.Node,
      resultVarName: string
    ): Set<string> {
      const used = new Set<string>();

      function traverse(currentNode: Rule.Node): void {
        if (currentNode.type === 'MemberExpression') {
          const member = currentNode as Rule.Node & {
            type: 'MemberExpression';
            object: Rule.Node;
            property: Rule.Node;
          };
          const object = member.object;
          if (
            object.type === 'Identifier' &&
            (object as Rule.Node & { type: 'Identifier'; name: string })
              .name === resultVarName &&
            member.property.type === 'Identifier'
          ) {
            used.add(
              (
                member.property as Rule.Node & {
                  type: 'Identifier';
                  name: string;
                }
              ).name
            );
          }
        }

        if (currentNode.type === 'ChainExpression') {
          const chain = currentNode as Rule.Node & {
            type: 'ChainExpression';
            expression: Rule.Node;
          };
          const expr = chain.expression;
          if (expr.type === 'MemberExpression') {
            const member = expr as Rule.Node & {
              type: 'MemberExpression';
              object: Rule.Node;
              property: Rule.Node;
            };
            const object = member.object;
            if (
              object.type === 'Identifier' &&
              (object as Rule.Node & { type: 'Identifier'; name: string })
                .name === resultVarName &&
              member.property.type === 'Identifier'
            ) {
              used.add(
                (
                  member.property as Rule.Node & {
                    type: 'Identifier';
                    name: string;
                  }
                ).name
              );
            }
          }
        }

        for (const key in currentNode) {
          if (key === 'parent' || key === 'range' || key === 'loc') {
            continue;
          }
          const value = (currentNode as unknown as Record<string, unknown>)[
            key
          ];
          if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
              for (const item of value) {
                if (item && typeof item === 'object' && 'type' in item) {
                  traverse(item as Rule.Node);
                }
              }
            } else if (value && 'type' in value) {
              traverse(value as Rule.Node);
            }
          }
        }
      }

      traverse(node);
      return used;
    }

    function getResultVariableName(node: Rule.Node): string | null {
      if (node.type !== 'CallExpression') {
        return null;
      }

      const parent = node.parent;
      if (!parent) {
        return null;
      }

      if (parent.type === 'VariableDeclarator') {
        const declarator = parent as Rule.Node & {
          type: 'VariableDeclarator';
          id: Rule.Node;
        };
        if (declarator.id.type === 'Identifier') {
          return (
            declarator.id as Rule.Node & {
              type: 'Identifier';
              name: string;
            }
          ).name;
        }
      }

      return null;
    }

    function findFunctionScope(
      scope: ReturnType<typeof sourceCode.getScope>
    ): ReturnType<typeof sourceCode.getScope> | null {
      if (scope.type === 'function' || scope.type === 'class') {
        return scope;
      }
      if (scope.upper) {
        return findFunctionScope(scope.upper);
      }
      return null;
    }

    return {
      CallExpression(node: Rule.Node) {
        if (!isZeigerHookCall(node)) {
          return;
        }

        const deps = getDependencyArray(node);
        if (deps === null) {
          return;
        }

        if (deps.length === 0) {
          context.report({
            node,
            messageId: 'emptyDeps',
          });
          return;
        }

        const resultVarName = getResultVariableName(node);
        if (!resultVarName) {
          return;
        }

        const currentScope = sourceCode.getScope(node);
        const functionScope = findFunctionScope(currentScope);

        if (!functionScope || !functionScope.block) {
          return;
        }

        const usedProperties = getUsedProperties(
          functionScope.block as Rule.Node,
          resultVarName
        );

        const callNode = node as Rule.Node & {
          type: 'CallExpression';
          arguments: Rule.Node[];
        };
        const depsArg =
          callNode.arguments.length > 0
            ? callNode.arguments[callNode.arguments.length - 1]
            : null;

        if (depsArg && depsArg.type === 'ArrayExpression') {
          const arrayNode = depsArg as Rule.Node & {
            type: 'ArrayExpression';
            elements: (Rule.Node | null)[];
          };
          const unusedDeps: {
            element: Rule.Node;
            index: number;
            property: string;
          }[] = [];

          for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            if (!usedProperties.has(dep)) {
              const depElement = arrayNode.elements[i];
              if (depElement) {
                unusedDeps.push({
                  element: depElement,
                  index: i,
                  property: dep,
                });
              }
            }
          }

          if (unusedDeps.length > 0) {
            const usedDeps = deps.filter((dep) => usedProperties.has(dep));

            for (const { element, property } of unusedDeps) {
              context.report({
                node: element,
                messageId: 'unusedDep',
                data: { property },
                fix(fixer) {
                  if (usedDeps.length === 0) {
                    return null;
                  }

                  const arrayText = usedDeps
                    .map((dep) => `'${dep}'`)
                    .join(', ');
                  const newArrayText = `[${arrayText}]`;

                  return fixer.replaceText(depsArg as Rule.Node, newArrayText);
                },
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
