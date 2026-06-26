/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {preinitScriptForSSR} from 'react-client/src/ReactFlightClientConfig';

export type ModuleLoading = null | {
  prefix: string,
  crossOrigin?: 'use-credentials' | '',
  // Optional map of chunk filename -> Subresource Integrity hash. When present,
  // React emits a matching `integrity` attribute on the <script> it
  // preinitializes for each client-component chunk during SSR. Sourced from the
  // bundler's SRI manifest (e.g. webpack-subresource-integrity).
  integrity?: {+[chunkFilename: string]: string},
};

export function prepareDestinationWithChunks(
  moduleLoading: ModuleLoading,
  // Chunks are double-indexed [..., idx, filenamex, idy, filenamey, ...]
  chunks: Array<string>,
  nonce: ?string,
) {
  if (moduleLoading !== null) {
    const integrityMap = moduleLoading.integrity;
    for (let i = 1; i < chunks.length; i += 2) {
      const filename = chunks[i];
      preinitScriptForSSR(
        moduleLoading.prefix + filename,
        nonce,
        moduleLoading.crossOrigin,
        integrityMap != null ? integrityMap[filename] : undefined,
      );
    }
  }
}
