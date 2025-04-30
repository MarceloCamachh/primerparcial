export const generateDesignFromUML = (parsed: any) => {
  console.log("🌟 parsed:", parsed);

  const model = parsed?.XMI?.["XMI.content"]?.["UML:Model"];
  console.log("📦 UML:Model:", model);

  const ownedElement = model?.["UML:Namespace.ownedElement"];
  console.log("📦 UML:Namespace.ownedElement:", ownedElement);

  if (!ownedElement) {
    console.warn("⚠️ No se encontró UML:Namespace.ownedElement");
    return { title: "Importado desde UML (sin clases)", elements: [] };
  }

  const elementsArray = Array.isArray(ownedElement) ? ownedElement : [ownedElement];
  console.log("🧩 elementsArray:", elementsArray);

  const availablePackages = elementsArray.filter(el => el["UML:Package"]);
const selectedPackage = availablePackages[0];

if (!selectedPackage) {
  console.warn("⚠️ No se encontró ningún paquete UML:Package");
  return { title: "Importado desde UML (sin clases)", elements: [] };
}

const packageName = selectedPackage["UML:Package"]?._attributes?.name || "SinNombre";
console.log("📦 Usando paquete:", packageName);

  const packageElements = selectedPackage["UML:Package"]?.["UML:Namespace.ownedElement"];
    console.log("📦 Elements dentro del Package:", packageElements);

  if (!packageElements) {
    console.warn("⚠️ No se encontró UML:Namespace.ownedElement dentro del paquete conceptual");
    return { title: "Importado desde UML (sin clases)", elements: [] };
  }

  const packageElementsArray = Array.isArray(packageElements) ? packageElements : [packageElements];

  // Corregimos: si UML:Class es array, lo aplanamos
  let classes: any[] = [];
  for (const el of packageElementsArray) {
    if (Array.isArray(el["UML:Class"])) {
      classes = classes.concat(el["UML:Class"]);
    } else if (el["UML:Class"]) {
      classes.push(el["UML:Class"]);
    }
  }

  console.log("📋 Clases finales encontradas:", classes);

  const elements: any[] = [];
  let offsetX = 100;
  let offsetY = 100;

  for (const cls of classes) {
    const className = cls._attributes?.name || "Entidad";
    console.log(`🚀 Procesando clase: ${className}`);

    elements.push({
      id: crypto.randomUUID(),
      type: "rectangle",
      translate: [offsetX, offsetY],
      rotate: 0,
      width: 300,
      height: 250,
    });

    elements.push({
      id: crypto.randomUUID(),
      type: "text",
      content: className,
      translate: [offsetX + 10, offsetY + 10],
      rotate: 0,
      width: 230,
      height: 30,
    });

    elements.push({
      id: crypto.randomUUID(),
      type: "button",
      content: "Crear",
      translate: [offsetX + 10, offsetY + 50],
      rotate: 0,
      width: 100,
      height: 30,
    });

    elements.push({
      id: crypto.randomUUID(),
      type: "button",
      content: "Editar",
      translate: [offsetX + 120, offsetY + 50],
      rotate: 0,
      width: 100,
      height: 30,
    });

    elements.push({
      id: crypto.randomUUID(),
      type: "button",
      content: "Eliminar",
      translate: [offsetX + 10, offsetY + 90],
      rotate: 0,
      width: 100,
      height: 30,
    });

    // 🧩 Agregar atributos visualmente
    const features = cls["UML:Classifier.feature"];
    const attributes = features?.["UML:Attribute"];

    if (attributes) {
      const attributesArray = Array.isArray(attributes) ? attributes : [attributes];
      let attrOffsetX = offsetX + 10;
      let attrOffsetY = offsetY + 130;

      for (const attr of attributesArray) {
        const attributeName = attr._attributes?.name || "atributo";

        elements.push({
          id: crypto.randomUUID(),
          type: "text",
          content: attributeName,
          translate: [attrOffsetX, attrOffsetY],
          rotate: 0,
          width: 100,
          height: 20,
        });

        elements.push({
          id: crypto.randomUUID(),
          type: "input",
          content: "",
          translate: [attrOffsetX + 60, attrOffsetY],
          rotate: 0,
          width: 120,
          height: 20,
        });

        attrOffsetY += 30;
      }
    }

    offsetX += 400;
    if (offsetX > 900) {
      offsetX = 100;
      offsetY += 400;
    }
  }

  return {
    title: "Importado desde UML",
    elements,
  };
};
