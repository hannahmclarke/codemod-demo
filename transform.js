/* Transforms <BigText, as="p"> instances to <Text as="p"> and modifies any attributes
 * to the correct Text attributes.
 * Any other <BigText> elements will remain unchanged.
 *
 * To run this codemod, run the following command:
 * npx jscodeshift -t app/componentCodemods/BigTextAsP/transform.js <directory path> --extensions=tsx,ts,js,jsx
 *
 */

export const parser = "tsx";
export default function (file, api) {
  // Don't run the codemod on itself

  if (file.path.includes("transform.js")) {
    return file.source;
  }

  const j = api.jscodeshift;
  const root = j(file.source);

  let isBigTextStillPresent = false;

  // Find and rename all <BigText as="p"...> instances to <Text as="p" ...>
  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "BigText",
        },
      },
    })
    .forEach((path) => {
      // If BigText has an 'isLoading' attribute, do not modify it
      if (
        path.node.openingElement.attributes.some(
          (attr) => attr.name.name === "isLoading"
        )
      ) {
        return;
      }
      // If BigText has an 'as="p"" attribute, rename it to Text
      if (
        path.node.openingElement.attributes.some(
          (attr) => attr.name.name === "as" && attr.value.value === "p"
        )
      ) {
        path.node.openingElement.name.name = "Text";
        path.node.closingElement.name.name = "Text";

        // remove spaced' attribute
        path.node.openingElement.attributes =
          path.node.openingElement.attributes.filter(
            (attr) => attr.name.name !== "spaced"
          );

        // Modify other attributes
        path.node.openingElement.attributes.forEach((attr) => {
          // 'subdued' becomes 'color="secondary"
          if (attr.name.name === "subdued") {
            attr.name.name = "color";
            attr.value = j.stringLiteral("secondary");
          }

          // 'bold' becomes 'variant="text.large.bold"
          if (attr.name.name === "bold") {
            attr.name.name = "variant";
            attr.value = j.stringLiteral("text.large.bold");
          }

          // 'semi' becomes 'variant="text.large.medium"
          else if (attr.name.name === "semi") {
            attr.name.name = "variant";
            attr.value = j.stringLiteral("text.large.medium");
          }

          // light becomes 'variant="text.large.regular"
          else if (attr.name.name === "light") {
            attr.name.name = "variant";
            attr.value = j.stringLiteral("text.large.regular");
          }
        });
      } else {
        isBigTextStillPresent = true;
      }
      /**
       * Check whether 'as="p" is present before adding default variant
       * to instances that do not have a variant present.
       * This ensures that the default variant is not added to other instances of
       * BigText that have not been modified.
       *
       */

      const hasAsP = path.node.openingElement.attributes.some(
        (attr) => attr.name.name === "as" && attr.value.value === "p"
      );
      if (hasAsP) {
        const hasVariant = path.node.openingElement.attributes.some(
          (attr) => attr.name.name === "variant"
        );
        if (!hasVariant) {
          path.node.openingElement.attributes.push(
            j.jsxAttribute(
              j.jsxIdentifier("variant"),
              j.stringLiteral("text.large.regular")
            )
          );
        }
      }
    });
  /**
   * The imports need to be modified as follows:
   * If no components have been changed, no changes are made to the imports.
   * If no BigText components still exist, the BigText import is replaced with Text.
   * If BigText components still exist, the Text import is added if it does not already exist.
   * If no BigText components exist within the file no changes are made to the imports.
   * If no BigText components still exist, but there is already a Text import, the BigText import is removed.
   */

  // Check if any Text components exist
  const hasTransformedComponents =
    root
      .find(j.JSXElement, {
        openingElement: {
          name: {
            name: "Text",
          },
        },
      })
      .size() > 0;

  // Check if a 'Text' import already exists
  const hasTextImport = root
    .find(j.ImportDeclaration)
    .some((path) =>
      path.node.specifiers.some(
        (specifier) =>
          j.ImportSpecifier.check(specifier) &&
          specifier.imported.name === "Text"
      )
    );

  // Find and replace (or add) in imports
  if (!hasTextImport && hasTransformedComponents) {
    // Replace BigText import with Text import if no BigText components still exist
    if (!isBigTextStillPresent) {
      root.find(j.ImportDeclaration).forEach((path) => {
        path.node.specifiers.forEach((specifier) => {
          if (
            j.ImportSpecifier.check(specifier) &&
            specifier.imported.name === "BigText"
          ) {
            specifier.imported.name = "Text";
          }
        });
      });
    }
    // Add a Text import if none exist and BigText components still exist
    else {
      root
        .find(j.ImportDeclaration, {
          source: {
            value: "component-library",
          },
        })
        .forEach((path) => {
          const textSpecifier = j.importSpecifier(j.identifier("Text"));
          path.node.specifiers.push(textSpecifier);
        });
    }
  }
  // Remove the BigText import if none remain, but a Text import is already present
  else if (
    hasTextImport &&
    hasTransformedComponents &&
    !isBigTextStillPresent
  ) {
    root
      .find(j.ImportDeclaration, {
        source: {
          value: "component-library",
        },
      })
      .forEach((path) => {
        path.node.specifiers = path.node.specifiers.filter(
          (specifier) =>
            !(
              j.ImportSpecifier.check(specifier) &&
              specifier.imported.name === "BigText"
            )
        );
      });
  }

  return root.toSource();
}
