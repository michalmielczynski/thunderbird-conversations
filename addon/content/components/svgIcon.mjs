/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";

/**
 * A basic SVG icon rendered using the `xlinkHref` ability
 * of SVGs. You can specify the full path, or just the hash.
 * Supports Thunderbird native icon styling with -moz-context-properties.
 *
 * @param {object} root0
 * @param {string} [root0.fullPath]
 * @param {string} [root0.hash]
 * @param {boolean} [root0.ariaHidden]
 * @param {boolean} [root0.fillOnly] - If true, only applies fill (no stroke)
 * @returns {React.ReactNode}
 */
export function SvgIcon({ fullPath, hash, ariaHidden = false, fillOnly = false }) {
  fullPath = fullPath || `material-icons.svg#${hash}`;
  
  // Build style object for Thunderbird native icon styling
  const iconStyle = {
    "--icon-size": "18px",
    "-moz-context-properties": fillOnly ? "fill" : "fill, stroke",
    "fill": "color-mix(in srgb, currentColor 20%, transparent)",
  };
  
  // Only add stroke if not fill-only
  if (!fillOnly) {
    iconStyle.stroke = "currentColor";
  }
  
  return React.createElement(
    "svg",
    {
      "aria-hidden": ariaHidden,
      className: "icon",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      xmlnsXlink: "http://www.w3.org/1999/xlink",
      style: iconStyle,
    },
    React.createElement("use", {
      "data-testid": "use",
      xlinkHref: `icons/${fullPath}`,
    })
  );
}
SvgIcon.propTypes = {
  fullPath: PropTypes.string,
  hash: PropTypes.string,
  ariaHidden: PropTypes.bool,
  fillOnly: PropTypes.bool,
};
