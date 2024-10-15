import { setFailed, getInput } from "@actions/core";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

const serviceName = getInput("service-name");
const serviceUrl = getInput("service-url");
const importMapPath = getInput("import-map-path");

if (!serviceName && !importMapPath) {
  setFailed(`Either service-name or import-map-path must be provided`);
}

const numServiceRequiredInputs = [serviceName, serviceUrl].filter(Boolean);

if (numServiceRequiredInputs === 1) {
  setFailed(
    `When deploying a service, both service-name and service-url must be provided`,
  );
}

if (serviceName) {
  const packageDirQuery = getInput("service-package-dir-level")
    ? `&packageDirLevel=${encodeURIComponent(getInput("service-package-dir-level"))}`
    : "";
  const requestBody = {
    service: serviceName,
    url: serviceUrl,
  };

  if (getInput("service-integrity")) {
    requestBody.integrity = getInput("service-integrity");
  } else if (getInput("service-integrity-file-path")) {
    const fileContents = await fs.readFile(
      getInput("service-integrity-file-path"),
      "utf-8",
    );
    requestBody.integrity =
      "sha384-" + createHash("sha384").update(fileContents).digest("base64");
  }

  const credentials = `${getInput("username")}:${getInput("password")}`;
  const requestHeaders = {
    "content-type": "application/json",
    Authorization: `Basic ${btoa(credentials)}`,
  };

  console.log(
    `Calling import-map-deployer to update service. Request body:`,
    requestBody,
  );

  const r = await fetch(
    `${getInput("host")}/services?env=${encodeURIComponent(getInput("environment-name"))}${packageDirQuery}`,
    {
      method: "PATCH",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
    },
  );

  if (r.ok) {
    console.log(
      `Successfully patched service '${serviceName}' to url '${serviceUrl}'. Response body:`,
      await r.json(),
    );
  } else {
    console.log(`response body: '${await r.text()}'`);
    setFailed(
      `PATCH request to import-map-deployer services endpoint failed with HTTP status '${r.status} ${r.statusText}'`,
    );
  }
}

if (importMapPath) {
  let importMap;
  try {
    importMap = await fs.readFile(importMapPath, "utf-8");
  } catch (err) {
    console.error(err);
    setFailed(`Could not read import map at file path '${importMapPath}'`);
  }

  const r = await fetch(
    `${getInput("host")}/import-map.json?env${encodeURIComponent(getInput("environment-name"))}`,
    {
      method: "PATCH",
      body: JSON.stringify(importMap),
      headers: requestHeaders,
    },
  );

  if (r.ok) {
    console.log(
      `Successfully patched import map. Response body:`,
      await r.json(),
    );
  } else {
    console.log(`response body: '${await r.text()}'`);
    setFailed(
      `PATCH request to import-map-deployer import map endpoint failed with HTTP status '${r.status} ${r.statusText}'`,
    );
  }
}
