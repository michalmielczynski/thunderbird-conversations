/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";
import { ContactDetail } from "../contactDetail.mjs";
import { messageActions } from "../../reducer/reducerMessages.mjs";
import { MessageHeaderOptions } from "./messageHeaderOptions.mjs";
import { MessageTags, SpecialMessageTags } from "./messageTags.mjs";

/**
 * Normalize a contact into a string (used for i18n formatting).
 *
 * @param {object} contact
 * @returns {string}
 */
function contactToString(contact) {
  return `${contact.name || ""} <${
    contact.displayEmail || contact.email
  }>`.trim();
}

/**
 * Opens `popup` when the child element(s) are hovered over,
 * or they are focused. The children are surrounded by a <span>.
 * Any additional props are passed to the surrounding <span>.
 * An element with `id=popup-container` is assumed to exist somewhere
 * near the root of the DOM. The children elements are rendered,
 * absolutely positions, inside the popup-container.
 *
 * @param {object} props
 * @param {object} [props.children]
 * @param {object} props.popup
 * @param {object} [props.style]
 */
function HoverFade({ children, popup, style }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [shouldShowPopup, setShouldShowPopup] = React.useState(false);
  const spanRef = React.useRef(null);
  const popupParentNode =
    document.querySelector("#popup-container") || spanRef.current;

  React.useEffect(() => {
    let timeoutId = null;
    if (isHovering) {
      // If we hover over the label, we delay showing the popup.
      timeoutId = window.setTimeout(() => {
        if (isHovering) {
          setShouldShowPopup(true);
        } else {
          setShouldShowPopup(false);
        }
      }, 400);
    } else {
      // If we're not hovering, we don't delay hiding the popup.
      setShouldShowPopup(false);
    }
    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isHovering, setShouldShowPopup]);

  // Calculate where to render the popup
  const pos = spanRef.current?.getBoundingClientRect() || {
    left: 0,
    top: 0,
    bottom: 0,
  };
  const parentPos = popupParentNode?.getBoundingClientRect() || {
    left: 0,
    top: 0,
    bottom: 0,
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "span",
      {
        ref: spanRef,
        className: "fade-parent",
        style,
        onMouseEnter: () => {
          setIsHovering(true);
        },
        onMouseLeave: () => {
          setIsHovering(false);
        },
      },
      children
    ),
    popupParentNode &&
      ReactDOM.createPortal(
        React.createElement(
          "div",
          {
            className: `fade-popup ${shouldShowPopup ? "hover" : ""}`,
            style: {
              left: pos.left - parentPos.left,
              top: pos.bottom - parentPos.top,
            },
          },
          popup
        ),
        popupParentNode
      )
  );
}

/**
 * Display an email address wrapped in <...> braces.
 *
 * @param {object} props
 * @param {string} props.email
 */
function Email({ email }) {
  return `<${email.trim()}>`;
}

/**
 * A detailed contact label.
 *
 * @param {object} props
 * @param {string} props.className
 * @param {object} props.contact
 * @param {number} props.msgId
 */
export function DetailedContactLabel({ contact, className, msgId }) {
  // This component conditionally renders.
  // In a detail view, there is a star at the start of the contact
  // info and a line break at the end.
  const star = contact.contactId && "\u2605 ";
  let emailLabel =
    contact.email &&
    React.createElement(
      "span",
      { className: "smallEmail" },
      " ",
      React.createElement(Email, { email: contact.email })
    );

  return React.createElement(
    HoverFade,
    {
      popup: React.createElement(ContactDetail, {
        name: contact.name,
        email: contact.displayEmail,
        msgId,
        realEmail: contact.email,
        avatar: contact.avatar,
        contactId: contact.contactId,
        contactIsReadOnly: contact.readOnly,
      }),
      style: { display: "inline-block" },
    },
    React.createElement(
      "span",
      { className },
      React.createElement(
        "span",
        { className: "contactName" },
        star,
        contact.name.trim(),
        emailLabel
      )
    )
  );
}

/**
 * Displays a contact label.
 *
 * @param {object} props
 * @param {string} props.className
 * @param {object} props.contact
 * @param {number} props.msgId
 */
export function ContactLabel({ contact, className, msgId }) {
  // This component conditionally renders.
  let emailLabel =
    contact.displayEmail &&
    React.createElement(
      "span",
      { className: "smallEmail" },
      " ",
      React.createElement(Email, { email: contact.displayEmail })
    );

  return React.createElement(
    HoverFade,
    {
      popup: React.createElement(ContactDetail, {
        name: contact.name,
        email: contact.displayEmail,
        msgId,
        realEmail: contact.email,
        avatar: contact.avatar,
        contactId: contact.contactId,
        contactIsReadOnly: contact.readOnly,
      }),
    },
    React.createElement(
      "span",
      { className },
      React.createElement(
        "span",
        { className: "contactName" },
        contact.name.trim(),
        emailLabel
      )
    )
  );
}

/**
 * Renders and Avatar icon - uses gentle tints of contact colors.
 *
 * @param {object} props
 * @param {string} [props.url]
 * @param {string} [props.initials]
 * @param {object} [props.style] - Contact color style, will be made more gentle
 */
function Avatar({ url, initials, style }) {
  // Create a gentle version of the contact color
  let gentleStyle = {};
  if (style && style.backgroundColor) {
    // Convert the color to a more subtle version
    const originalColor = style.backgroundColor;
    // Use CSS to make the color more gentle by mixing with background
    gentleStyle = {
      backgroundColor: originalColor,
      opacity: 0.5,
      backgroundBlendMode: 'multiply'
    };
  }

  if (!url) {
    return React.createElement(
      "abbr",
      { className: "contactInitials", style: gentleStyle },
      initials
    );
  }
  return React.createElement(
    "span",
    {
      className: "contactAvatar",
      style: { backgroundImage: `url('${url}')` },
    },
    "\u00a0"
  );
}

/**
 * Handles display for the header of a message.
 *
 * @param {object} props
 * @param {object[]} props.bcc
 * @param {object[]} props.cc
 * @param {boolean} props.overrideDarkMode
 * @param {Function} props.dispatch
 * @param {string} props.date
 * @param {boolean} props.detailsShowing
 * @param {boolean} props.expanded
 * @param {object} [props.from]
 * @param {string} props.fullDate
 * @param {number} props.id
 * @param {boolean} props.inView
 * @param {object[]} props.attachments
 * @param {boolean} props.multipleRecipients
 * @param {boolean} props.recipientsIncludeLists
 * @param {boolean} props.isDraft
 * @param {string} [props.shortFolderName]
 * @param {string} props.snippet
 * @param {boolean} props.starred
 * @param {object[]} props.tags
 * @param {object[]} props.specialTags
 * @param {object[]} props.to
 */
export function MessageHeader({
  starred,
  expanded,
  from,
  id,
  overrideDarkMode,
  dispatch,
  bcc,
  cc,
  date,
  detailsShowing,
  fullDate,
  attachments,
  multipleRecipients,
  recipientsIncludeLists,
  isDraft,
  inView,
  shortFolderName,
  snippet,
  tags,
  specialTags,
  to,
}) {
  function onClickHeader() {
    dispatch(
      messageActions.expandMsg({
        expand: !expanded,
        id,
      })
    );
  }

  function onClickStar(event) {
    event.stopPropagation();
    dispatch(
      messageActions.setStarred({
        id,
        starred: !starred,
      })
    );
  }

  // TODO: Maybe insert this after contacts but before snippet:
  // <span class="bzTo"> {{str "message.at"}} {{bugzillaUrl}}</span>

  let extraContacts = null;
  if (expanded && !detailsShowing) {
    const allTo = [...to, ...cc, ...bcc];
    const allToMap = new Map(
      allTo.map((contact) => [contactToString(contact), contact])
    );
    const locale = browser.i18n.getUILanguage();

    extraContacts = React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "span",
        { className: "to-label" },
        browser.i18n.getMessage("header.to") + " "
      ),
      new Intl.ListFormat(locale, { style: "long", type: "conjunction" })
        .formatToParts(allToMap.keys())
        .map((item, i) => {
          if (item.type === "literal") {
            return React.createElement(
              "span",
              { className: "to", key: i },
              item.value
            );
          }
          const contact = allToMap.get(item.value);
          return React.createElement(ContactLabel, {
            className: "to",
            contact,
            key: item.value,
            msgId: id,
          });
        })
    );
  }
  if (!expanded) {
    extraContacts = React.createElement(React.Fragment);
  }

  // For collapsed messages, use two-row layout like Thunderbird's native inbox
  if (!expanded) {
    return React.createElement(
      "div",
      {
        className: "messageHeader collapsed-two-row",
        onClick: onClickHeader,
      },
      // Row 1: Author info, tags, and date/options
      React.createElement(
        "div",
        { className: "header-row-1" },
        React.createElement(
          "div",
          { className: "author-info" },
          React.createElement(
            "button",
            {
              className: starred ? "button-star flagged" : "button-star",
              "aria-label": starred
                ? (browser.i18n.getMessage("message.removeStar.tooltip") || "Remove Star")
                : (browser.i18n.getMessage("message.addStar.tooltip") || "Add Star"),
              title: starred
                ? (browser.i18n.getMessage("message.removeStar.tooltip") || "Remove Star")
                : (browser.i18n.getMessage("message.addStar.tooltip") || "Add Star"),
              onClick: onClickStar,
              tabIndex: 0,
            },
            React.createElement("img", {
              src: starred
                ? "chrome://messenger/skin/icons/new/compact/star-filled.svg"
                : "chrome://messenger/skin/icons/new/compact/star.svg",
              alt: starred ? "★" : "☆",
            })
          ),
          !!from &&
            React.createElement(
              React.Fragment,
              null,
              React.createElement(Avatar, {
                url: from.avatar,
                style: from.colorStyle,
                initials: from.initials,
              }),
              " ",
              React.createElement(ContactLabel, {
                className: "author",
                contact: from,
                msgId: id,
              })
            ),
          React.createElement(MessageTags, {
            onTagsChange: (newTags) => {
              dispatch(
                messageActions.setTags({
                  id,
                  tags: newTags,
                })
              );
            },
            expanded: false,
            tags,
          }),
          React.createElement(SpecialMessageTags, {
            onTagClick: (event, tag) => {
              dispatch(
                messageActions.tagClick({
                  event,
                  id,
                  details: tag.details,
                })
              );
            },
            folderName: shortFolderName,
            inView,
            specialTags,
          })
        ),
        React.createElement(MessageHeaderOptions, {
          dispatch,
          overrideDarkMode,
          date,
          detailsShowing,
          expanded,
          fullDate,
          id,
          attachments,
          multipleRecipients,
          recipientsIncludeLists,
          isDraft,
        })
      ),
      // Row 2: Subject/snippet only
      React.createElement(
        "div",
        { className: "header-row-2" },
        React.createElement(
          "span",
          { className: "snippet" },
          snippet
        )
      )
    );
  }

  // For expanded messages, use a layout similar to collapsed but with more space
  return React.createElement(
    "div",
    {
      className: `messageHeader expanded-two-row ${expanded ? "expanded" : ""}`,
      onClick: onClickHeader,
    },
    // Row 1: Author info, tags, and date/options
    React.createElement(
      "div",
      { className: "header-row-1" },
      React.createElement(
        "div",
        { className: "author-info-expanded" },
        React.createElement(
          "button",
          {
            className: starred ? "button-star flagged" : "button-star",
            "aria-label": starred
              ? (browser.i18n.getMessage("message.removeStar.tooltip") || "Remove Star")
              : (browser.i18n.getMessage("message.addStar.tooltip") || "Add Star"),
            title: starred
              ? (browser.i18n.getMessage("message.removeStar.tooltip") || "Remove Star")
              : (browser.i18n.getMessage("message.addStar.tooltip") || "Add Star"),
            onClick: onClickStar,
            tabIndex: 0,
          },
          React.createElement("img", {
            src: starred
              ? "chrome://messenger/skin/icons/new/compact/star-filled.svg"
              : "chrome://messenger/skin/icons/new/compact/star.svg",
            alt: starred ? "★" : "☆",
          })
        ),
        !!from &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Avatar, {
              url: from.avatar,
              style: from.colorStyle,
              initials: from.initials,
            }),
            " ",
            React.createElement(ContactLabel, {
              className: "author",
              contact: from,
              msgId: id,
            })
          ),
        React.createElement(MessageTags, {
          onTagsChange: (newTags) => {
            dispatch(
              messageActions.setTags({
                id,
                tags: newTags,
              })
            );
          },
          expanded: false,
          tags,
        }),
        React.createElement(SpecialMessageTags, {
          onTagClick: (event, tag) => {
            dispatch(
              messageActions.tagClick({
                event,
                id,
                details: tag.details,
              })
            );
          },
          folderName: shortFolderName,
          inView,
          specialTags,
        })
      ),
      React.createElement(MessageHeaderOptions, {
        dispatch,
        overrideDarkMode,
        date,
        detailsShowing,
        expanded,
        fullDate,
        id,
        attachments,
        multipleRecipients,
        recipientsIncludeLists,
        isDraft,
      })
    ),
    // Row 2: Recipients info
    extraContacts && React.createElement(
      "div",
      { className: "header-row-2" },
      extraContacts
    )
  );
}
