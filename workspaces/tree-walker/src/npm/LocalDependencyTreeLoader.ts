// Import Node.js Dependencies
import path from "node:path";
import fs from "node:fs/promises";

// Import Third-party Dependencies
import Arborist from "@npmcli/arborist";

// Import Internal Dependencies
import * as utils from "../utils/index.js";

export interface LocalDependencyTreeLoaderProvider {
  load(
    location: string,
    registry?: string
  ): Promise<Arborist.Node>;
}

export class LocalDependencyTreeLoader implements LocalDependencyTreeLoaderProvider {
  async load(
    location: string,
    registry?: string
  ): Promise<Arborist.Node> {
    const arb = new Arborist({
      ...utils.NPM_TOKEN,
      path: location,
      registry
    });

    try {
      await fs.access(
        path.join(location, "node_modules")
      );

      await arb.loadActual();

      return arb.buildIdealTree();
    }
    catch {
      return arb.loadVirtual();
    }
  }
}
