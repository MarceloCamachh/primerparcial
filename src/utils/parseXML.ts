import { xml2js } from "xml-js";

export const parseXMLFile = async (file: File) => {
  const text = await file.text();
  const result = xml2js(text, { compact: true });
  return result;
};