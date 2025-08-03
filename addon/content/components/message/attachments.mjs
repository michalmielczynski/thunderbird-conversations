/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import { attachmentActions } from "../../reducer/reducerAttachments.mjs";
import { SvgIcon } from "../svgIcon.mjs";

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

  // Clean attachment name by removing any "< >" characters that might be added by various sources
  const cleanName = name ? name.replace(/<\s*>/g, '').trim() : '';

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



  let isDeleted = contentType == "text/x-moz-deleted";

  let isImage = contentType.startsWith("image/");
  let attachmentTitle = isImage
    ? browser.i18n.getMessage("attachments.viewAttachment.tooltip")
    : browser.i18n.getMessage("attachments.open.tooltip");

  let handleAttachmentClick = null;
  if (!isDeleted) {
    handleAttachmentClick = isImage ? preview : openAttachment;
  }

  // Helper function to determine file type icon based on content type
  // Only uses icons that exist in material-icons.svg
  function getFileTypeIcon(contentType) {
    if (contentType.startsWith("image/")) {
      return "photo_library";
    } else if (contentType.startsWith("audio/")) {
      return "whatshot"; // Using available icon as fallback
    } else if (contentType.startsWith("video/")) {
      return "visibility"; // Using available icon as fallback
    } else if (contentType.includes("pdf")) {
      return "print"; // Using print icon for PDFs
    } else if (contentType.includes("html") || contentType.includes("xml")) {
      return "code";
    } else if (contentType.includes("text/")) {
      return "list"; // Using list icon for text files
    } else if (contentType.includes("zip") || contentType.includes("compressed") || contentType.includes("archive")) {
      return "archive";
    } else if (contentType.includes("word") || contentType.includes("document") || contentType.includes("officedocument")) {
      return "save"; // Using save icon for office documents
    } else {
      return "attachment"; // Default fallback to attachment icon
    }
  }

  // TODO: Drag n drop
  // onDragStart={this.onDragStart}
  return React.createElement(
    "li",
    {
      className: `attachment ${isDeleted ? 'deleted' : 'clickable'}`,
      onClick: handleAttachmentClick,
      title: !isDeleted ? attachmentTitle : undefined
    },
    React.createElement(
      "div",
      { className: "attachment-type-icon" },
      React.createElement(
        SvgIcon,
        { hash: getFileTypeIcon(contentType) }
      )
    ),
    React.createElement(
      "div",
      { className: "attachmentInfo" },
      React.createElement("span", { className: "filename" }, cleanName),
      React.createElement("span", { className: "filesize" }, formattedSize)
    ),
    React.createElement(
      "div",
      { className: "attachment-actions-row" },
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
  function downloadAllAttachments(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(
      attachmentActions.downloadAll({
        id,
      })
    );
  }

  return React.createElement(
    "ul",
    { className: "attachments" },
    attachments.length > 0 && React.createElement(
      "div",
      { className: "attachHeader" },
      React.createElement(
        "span",
        { className: "attachHeaderText" },
        attachmentsPlural
      ),
      attachments.length > 1 && React.createElement(
        "button",
        {
          className: "icon-link save-all-attachments",
          title: browser.i18n.getMessage("attachments.downloadAll.tooltip"),
          onClick: downloadAllAttachments,
          type: "button",
        },
        React.createElement(SvgIcon, { hash: "file_download" })
      )
    ),
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
