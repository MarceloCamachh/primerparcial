import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Design } from "../services/designService";

export const generateAngularProject = async (design: Design) => {
  const zip = new JSZip();
  const templatePath = "/angular-template";

  // 1️⃣ Copiar todo el template conservando la estructura
  const templateFiles = [
    "angular.json",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.spec.json",
    "src/index.html",
    "src/main.ts",
    "src/styles.css",
    "src/app/app.component.ts",
    "src/app/app.component.spec.ts",
    "src/app/app.config.ts",
    "src/app/app.routes.ts",
    "src/app/app.component.css",
  ];

  // Copiar archivos estáticos
  await Promise.all(templateFiles.map(async (file) => {
    const response = await fetch(`${templatePath}/${file}`);
    const content = await response.text();
    zip.file(file, content);
  }));

  // 2️⃣ Generar dinámicamente el app.component.html
  const dynamicHtml = `
    <h1>${design.title}</h1>
    ${design.data.map((el: any) => {
      if (el.type === "text") return `<p>${el.content}</p>`;
      if (el.type === "button") return `<button>${el.content}</button>`;
      if (el.type === "input") return `<input placeholder="${el.content}" />`;
      if (el.type === "rectangle") return `<div class="rectangle"></div>`;
      return "";
    }).join("\n")}
  `;

  zip.file("src/app/app.component.html", dynamicHtml);

  // 3️⃣ Generar el ZIP final
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "angular-project.zip");
};
