import { setFailed, getInput } from "@actions/core";

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
  }

  const r = await fetch(
    `${getInput("host")}/services?env=${encodeURIComponent(getInput("environment-name"))}${packageDirQuery}`,
    {
      method: "PATCH",
      body: JSON.stringify(requestBody),
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${getInput("username")}:${getInput("password")}`,
      },
    },
  );

  if (r.ok) {
    console.log(
      `Successfully patched service '${serviceName}'. Response body:`,
      await r.json(),
    );
  } else {
    console.log("response body", await r.text());
    setFailed(
      `PATCH request to import-map-deployer services endpoint failed with HTTP status '${r.status} ${r.statusText}'`,
    );
  }
}

if (importMapPath) {
  const r = await fetch(
    `${getInput("host")}/import-map.json?env${encodeURIComponent(getInput("environment-name"))}`,
    {
      method: "PATCH",
      body: JSON.stringify(importMap),
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${getInput("username")}:${getInput("password")}`,
      },
    },
  );

  if (r.ok) {
    console.log(
      `Successfully patched import map. Response body:`,
      await r.json(),
    );
  } else {
    console.log("response body", await r.text());
    setFailed(
      `PATCH request to import-map-deployer import map endpoint failed with HTTP status '${r.status} ${r.statusText}'`,
    );
  }
}
