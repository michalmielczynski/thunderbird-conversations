/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import * as ReactRedux from "react-redux";
import PropTypes from "prop-types";
import { ConversationFooter } from "./conversationFooter.mjs";
import { ConversationHeader } from "./conversationHeader.mjs";
import { MessageList } from "../message/messageList.mjs";

/**
 * This is a wrapper class around the whole conversation. It also kicks off
 * the message loading routines.
 */
class _ConversationWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // When moving to a WebExtension page this can simply be moved to CSS (see
    // https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Internationalization).
    document.documentElement.setAttribute(
      "dir",
      browser.i18n.getMessage("@@bidi_dir")
    );
  }

  componentDidUpdate(prevProps) {
    // When moving to a WebExtension page this can simply be moved to CSS (see
    // https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Internationalization).
    document.documentElement.setAttribute(
      "dir",
      browser.i18n.getMessage("@@bidi_dir")
    );
  }

  render() {
    if (this.props.messageNotFound) {
      return React.createElement(
        React.Fragment,
        null,
        browser.i18n.getMessage("message.movedOrDeletedConversation")
      );
    }
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", { id: "popup-container" }),
      React.createElement(ConversationHeader),
      React.createElement(MessageList),
      React.createElement(ConversationFooter)
    );
  }
}

_ConversationWrapper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  messageNotFound: PropTypes.bool.isRequired,
};

export const ConversationWrapper = ReactRedux.connect((state) => {
  return {
    messageNotFound: state.summary.messageNotFound,
  };
})(_ConversationWrapper);
