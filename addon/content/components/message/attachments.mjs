/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { attachmentActions } from "../../reducer/reducerAttachments.mjs";
import { SvgIcon } from "../svgIcon.mjs";

const ICON_MAPPING = new Map([
  ["application/msword", "x-office-document"],
  ["application/vnd.ms-excel", "x-office-spreadsheet"],
  ["application/vnd.ms-powerpoint", "x-office-presentation"],
  ["application/rtf", "x-office-document"],
  ["application/zip", "package-x-generic"],
  ["application/bzip2", "package-x-generic"],
  ["application/x-gzip", "package-x-generic"],
  ["application/x-tar", "package-x-generic"],
  ["application/x-compressed", "package-x-generic"],
  // "message/": "email",
  ["text/x-vcalendar", "x-office-calendar"],
  ["text/x-vcard", "x-office-address-book"],
  ["text/html", "text-html"],
  ["application/pdf", "application-pdf"],
  ["application/x-pdf", "application-pdf"],
  ["application/x-bzpdf", "application-pdf"],
  ["application/x-gzpdf", "application-pdf"],
]);

const FALLBACK_ICON_MAPPING = new Map([
  // Fallbacks, at the end.
  ["video/", "video-x-generic"],
  ["audio/", "audio-x-generic"],
  ["image/", "image-x-generic"],
  ["text/", "text-x-generic"],
]);

/**
 * Handles display of an individual attachment.
 *
 * @param {object} options
 * @param {string} options.anchor
 * @param {Function} options.dispatch
 * @param {string} options.contentType
 * @param {string} options.formattedSize
 * @param {string} options.name
 * @param {number} options.size
 * @param {string} options.partName
 * @param {number} options.id
 */
function Attachment({
  anchor,
  dispatch,
  contentType,
  formattedSize,
  name,
  size,
  partName,
  id,
}) {


  function preview(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      attachmentActions.previewAttachment({
        name,
        id,
        partName,
      })
    );
  }

  function openAttachment(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      attachmentActions.openAttachment({
        id,
        partName,
      })
    );
  }

  // TODO: Fix drag n drop of attachments.
  // onDragStart(event) {
  //   let info;
  //   if (/(^file:|&filename=)/.test(this.props.url)) {
  //     info = this.props.url;
  //   } else {
  //     info =
  //       this.props.url +
  //       "&type=" +
  //       this.props.contentType +
  //       "&filename=" +
  //       encodeURIComponent(this.props.name);
  //   }
  //   event.dataTransfer.setData(
  //     "text/x-moz-url",
  //     `${info}\n${this.props.name}\n${this.props.size}`
  //   );
  //   event.dataTransfer.setData("text/x-moz-url-data", this.props.url);
  //   event.dataTransfer.setData("text/x-moz-url-desc", this.props.name);
  //   event.dataTransfer.setData(
  //     "application/x-moz-file-promise-url",
  //     this.props.url
  //   );
  //   event.dataTransfer.setData("application/x-moz-file-promise", null);
  //   event.stopPropagation();
  // }

  function downloadAttachment(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      attachmentActions.downloadAttachment({
        id,
        partName,
      })
    );
  }



  function iconForMimeType(mimeType) {
    if (ICON_MAPPING.has(mimeType)) {
      return ICON_MAPPING.get(mimeType) + ".svg";
    }
    let split = mimeType.split("/");
    if (split.length && FALLBACK_ICON_MAPPING.has(split[0] + "/")) {
      return FALLBACK_ICON_MAPPING.get(split[0] + "/") + ".svg";
    }
    return "gtk-file.png";
  }

  let isDeleted = contentType == "text/x-moz-deleted";

  let isImage = contentType.startsWith("image/");
  let imgTitle = isImage
    ? browser.i18n.getMessage("attachments.viewAttachment.tooltip")
    : browser.i18n.getMessage("attachments.open.tooltip");

  let [thumb, setThumb] = React.useState(null);
  let [imgClass, setImgClass] = React.useState(null);
  React.useEffect(() => {
    if (isImage) {
      // TODO: Can we load images separately and make them available later,
      // so that we're not relying on having the url here. This would
      // mean we can use browser.messages.listAttachments.
      (async () => {
        let file = await browser.messages.getAttachmentFile(id, partName);
        setThumb(URL.createObjectURL(file));
        setImgClass("resize-me");
      })();
    } else {
      setThumb("icons/" + iconForMimeType(contentType));
      setImgClass("mime-icon");
    }
  }, [id, contentType, partName]);

  // TODO: Drag n drop
  // onDragStart={this.onDragStart}
  return React.createElement(
    "li",
    { className: "attachment" },
    isDeleted &&
      React.createElement(
        "div",
        { className: "attachmentThumb deleted", draggable: "false" },
        React.createElement("img", {
          className: imgClass,
          src: thumb,
          title: name,
        })
      ),
    !isDeleted &&
      React.createElement(
        "div",
        {
          className: "attachmentThumb",
          draggable: "false",
          onClick: isImage ? preview : openAttachment,
        },
        React.createElement("img", {
          className: imgClass,
          src: thumb,
          title: imgTitle,
        })
      ),
    React.createElement(
      "div",
      { className: "attachmentInfo align" },
      React.createElement("span", { className: "filename" }, name),
      React.createElement("span", { className: "filesize" }, formattedSize),
      !isDeleted &&
        React.createElement(
          "div",
          { className: "attachActions" },
          React.createElement(
            "button",
            {
              className: "icon-link download-attachment",
              title: browser.i18n.getMessage("attachments.download.tooltip"),
              onClick: downloadAttachment,
              type: "button",
            },
            React.createElement(SvgIcon, { hash: "file_download" })
          )
        )
    )
  );
}

/**
 * Handles display of attachments within a message, including options that
 * apply to all attachments.
 *
 * @param {object} options
 * @param {Function} options.dispatch
 * @param {object[]} options.attachments
 * @param {string} options.attachmentsPlural
 * @param {number} options.id
 */
export function Attachments({ dispatch, attachments, attachmentsPlural, id }) {
  return React.createElement(
    "ul",
    { className: "attachments" },
    attachments.map((attachment) =>
      React.createElement(Attachment, {
        anchor: attachment.anchor,
        dispatch,
        key: attachment.anchor,
        contentType: attachment.contentType,
        formattedSize: attachment.formattedSize,
        id,
        name: attachment.name,
        partName: attachment.partName,
        size: attachment.size,
      })
    )
  );
}
