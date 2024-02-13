/* Transforms <LargeText, as="p"> instances to <Text as="p"> and modifies any attributes

* to the correct Text attributes.

* Any other <LargeText> elements will remain unchanged.

*

* To run this codemod, run the following command:

* npx jscodeshift -t app/componentCodemods/LargeTextAsP/transform.js <directory path> --extensions=tsx,ts,js,jsx

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

let isLargeTextStill Present = false;

// Find and rename all <LargeText as="p"...> instances to <Text as="p" ...>

root

.find(j.JSXElement, {

opening Element: {

name: {

name: "LargeText",

},

},

})

.forEach(path => {

// If LargeText has an 'isLoading' attribute, do not modify it

if (

path.node.openingElement.attributes.some(

attr => attr.name.name === "isLoading"

)

return;

}

// If LargeText has an 'as="p"" attribute, rename it to Text

if (

path.node.openingElement.attributes.some(

attr => attr.name.name === "as" && attr.value.value === "p"

)

path.node.openingElement.name.name = "Text";

path.node.closingElement.name.name = "Text";

// remove spaced' attribute

path.node.openingElement.attributes = path.node.openingElement.attributes.filter( attr attr.name.name !== "spaced"
);


// Modify other attributes

path.node.openingElement.attributes.forEach(attr(

// 'subdued' becomes 'color="secondary

if (attr.name.name = "subdued") {

attr.name.name = "color";

}

attr.value = j.stringLiteral("secondary");

// 'bold' becomes 'variant="body.size16.medium"

else if (attr.name.name = "bold") {

attr.name.name = "variant";

} attr.value = j.stringLiteral("body.size16.medium");

// 'semibold' becomes 'variant="body.size16.medium"

else if (attr.name.name = "semibold") {

attr.name.name = "variant";

}

attr.valuej.stringLiteral("body.size16.medium");

// light becomes 'variant="body.size16.regular"

else if (attr.name.name = "light") {

} });

attr.name.name = "variant";

attr.value = j.stringLiteral("body.size16.regular");

} else {

isLargeTextStillPresent = true;

/**

* Check whether 'as="p" is present before adding default variant

* to instances that do not have a variant present.

* This ensures that the default variant is not added to other instances of

* LargeText that have not been modified.
* 
*/

const hasAsP = path.node.openingElement.attributes.some(

attr attr.name.name = "as" & attr.value.value == "p"
);

if (hasAsP) {

const hasVariant = path.node.openingElement.attributes.some (

attr => attr.name.name = "variant"
);

if (!hasVariant) {

path.node.openingElement.attributes.push(

j.jsxAttribute(

j.jsxIdentifier("variant"), j.stringLiteral("body.size16.regular")
)
);
}
}
});
/**

* The imports need to be modified as follows:

* If no components have been changed, no changes are made to the imports.

* If no Large Text components still exist, the LargeText import is replaced with Text.

* If LargeText components still exist, the Text import is added if it does not already exist.

* If no Large Text components exist within the file no changes are made to the imports.

* If no LargeText components still exist, but there is already a Text import, the LargeText import is removed.

*/

// Check if any Text components exist

const hasTransformed Components =

root

.find(j.JSXElement, {

opening Element: {

name: {

name: "Text",

},

},

})

.size() > 0;

// Check if a 'Text' import already exists

const hasTextImport = root

.find(j.ImportDeclaration)

.some(path =>

path.node.specifiers.some (

specifier =>

j.ImportSpecifier.check(specifier) && specifier.imported.name === "Text"

)

);

// Find and replace (or add) in imports

if (!hasTextImport && has Transformed Components) {

// Replace LargeText import with Text import if no LargeText components still exist

if (!isLargeTextStillPresent) {

root.find(j.ImportDeclaration).forEach(path => {

path.node.specifiers.forEach(specifier => {

if (

j.ImportSpecifier.check(specifier) && specifier.imported.name === "LargeText"

) {

specifier.imported.name = "Text";

}

}

});

});

// Add a Text import if none exist and Large Text components still exist

else {

root

.find(j.ImportDeclaration, {

})

source: {

},

value: "matter",

.forEach(path => {

});

const textSpecifier = 1, importSpecifier(j, identifier("Text"));

path.node.specifiers.push(textSpecifier);

// Remove the LargeText import if none remain, but a Text import is already present

else if (

hasTextImport &&

has TransformedComponents &&

!isLargeTextStillPresent

) {

root

.find(j.ImportDeclaration, {

source: {

value: "matter",

},

})

.forEach(path => {

path.node.specifiers = path.node.specifiers.filter(

specifier

1.ImportSpecifier.check(specifier) && specifier, imported.name === "LargeText"

);

});

}

return root,toSource();

}