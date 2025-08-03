/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import * as ReactRedux from "react-redux";
import PropTypes from "prop-types";
import { messageActions } from "../../reducer/reducerMessages.mjs";
import { summaryActions } from "../../reducer/reducerSummary.mjs";
import { SvgIcon } from "../svgIcon.mjs";

const LINKS_REGEX = /((\w+):\/\/[^<>()'"\s]+|www(\.[-\w]+){2,})/;

/**
 * Handles inserting links into the subject of a message.
 */
class LinkifiedSubject extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.dispatch(summaryActions.openLink({ url: event.target.title }));
    event.preventDefault();
  }

  render() {
    let subject = this.props.subject;
    if (this.props.loading) {
      subject = browser.i18n.getMessage("message.loading");
    } else if (!subject) {
      subject = browser.i18n.getMessage("message.noSubject");
    } else if (LINKS_REGEX.test(subject)) {
      let contents = [];
      let text = subject;
      let i = 0;
      while (text && LINKS_REGEX.test(text)) {
        let matches = LINKS_REGEX.exec(text);
        let [pre, ...post] = text.split(matches[1]);
        let link = React.createElement(
          "a",
          {
            href: matches[1],
            title: matches[1],
            className: "link",
            onClick: this.handleClick,
            key: i++,
          },
          matches[1]
        );
        if (pre) {
          contents.push(pre);
        }
        contents.push(link);
        text = post.join(matches[1]);
      }
      if (text) {
        contents.push(text);
      }

      return React.createElement(
        "div",
        { className: "subject", title: subject },
        React.createElement("span", null, contents)
      );
    }

    return React.createElement(
      "div",
      { className: "subject", title: subject },
      subject
    );
  }
}

LinkifiedSubject.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  subject: PropTypes.string.isRequired,
};

/**
 * Handles display for the header of the conversation.
 */
class _ConversationHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.archiveToolbar = this.archiveToolbar.bind(this);
    this.delete = this.delete.bind(this);
    this.detachTab = this.detachTab.bind(this);
    this.expandCollapse = this.expandCollapse.bind(this);
    this.junkConversation = this.junkConversation.bind(this);
    this.toggleRead = this.toggleRead.bind(this);
  }

  archiveToolbar(event) {
    this.props.dispatch(messageActions.archiveConversation());
  }

  delete(event) {
    this.props.dispatch(messageActions.deleteConversation());
  }

  /**
   * This function gathers various information, encodes it in a URL query
   * string, and then opens a regular chrome tab that contains our
   * conversation.
   *
   * @param {Event} event
   */
  detachTab(event) {
    this.props.dispatch(messageActions.detachTab());
  }

  get areSomeMessagesCollapsed() {
    return !this.props.msgData?.some((msg) => msg.expanded);
  }

  get areSomeMessagesUnread() {
    return this.props.msgData?.some((msg) => !msg.read);
  }

  get canJunk() {
    // TODO: Disable if in just a new tab? (e.g. double-click)
    // as per old comment:
    // We can never junk a conversation in a new tab, because the junk
    // command only operates on selected messages, and we're not in a
    // 3pane context anymore.

    return (
      this.props.msgData &&
      this.props.msgData.length <= 1 &&
      this.props.msgData.some((msg) => !msg.isJunk)
    );
  }

  expandCollapse(event) {
    this.props.dispatch(
      messageActions.toggleConversationExpanded({
        expand: this.areSomeMessagesCollapsed,
      })
    );
  }

  junkConversation(event) {
    // This callback is only activated when the conversation is not a
    //  conversation in a tab AND there's only one message in the conversation,
    //  i.e. the currently selected message
    this.props.dispatch(
      messageActions.markAsJunk({
        id: this.props.msgData[0].id,
        isJunk: true,
      })
    );
  }

  // Mark the current conversation as read/unread. The conversation driver
  //  takes care of setting the right class on us whenever the state
  //  changes...
  toggleRead(event) {
    this.props.dispatch(
      messageActions.toggleConversationRead({
        read: this.areSomeMessagesUnread,
      })
    );
  }

  render() {
    document.title = this.props.subject;
    return React.createElement(
      "div",
      { className: "conversationHeaderWrapper" },
      React.createElement(
        "div",
        { className: "conversationHeader" },
        React.createElement(LinkifiedSubject, {
          dispatch: this.props.dispatch,
          loading: this.props.loading,
          subject: this.props.subject,
        }),
        React.createElement(
          "div",
          { className: "actions" },
          React.createElement(
            "button",
            {
              className: "quickfilter-btn",
              title: browser.i18n.getMessage("message.detach.tooltip"),
              onClick: this.detachTab,
            },
            React.createElement(SvgIcon, {
              ariaHidden: true,
              hash: "open_in_new",
            })
          ),
          React.createElement(
            "button",
            {
              className: `quickfilter-btn ${
                this.areSomeMessagesUnread ? "active" : ""
              }`,
              title: browser.i18n.getMessage("message.read.tooltip"),
              onClick: this.toggleRead,
            },
            React.createElement(SvgIcon, { ariaHidden: true, hash: "mail" })
          ),
          React.createElement(
            "button",
            {
              className: `quickfilter-btn ${
                !this.areSomeMessagesCollapsed ? "active" : ""
              }`,
              title: browser.i18n.getMessage("message.expand.tooltip"),
              onClick: this.expandCollapse,
            },
            React.createElement(SvgIcon, {
              ariaHidden: true,
              hash: this.areSomeMessagesCollapsed ? "expand_more" : "expand_less",
            })
          ),
          this.canJunk &&
            React.createElement(
              "button",
              {
                className: "quickfilter-btn",
                title: browser.i18n.getMessage("message.junk.tooltip"),
                onClick: this.junkConversation,
              },
              React.createElement(SvgIcon, {
                ariaHidden: true,
                hash: "whatshot",
              })
            ),
          React.createElement(
            "button",
            {
              className: "quickfilter-btn",
              title: browser.i18n.getMessage("message.archive.tooltip"),
              onClick: this.archiveToolbar,
            },
            React.createElement(SvgIcon, { ariaHidden: true, hash: "archive" })
          ),
          React.createElement(
            "button",
            {
              className: "quickfilter-btn",
              title: browser.i18n.getMessage("message.trash.tooltip"),
              onClick: this.delete,
            },
            React.createElement(SvgIcon, { ariaHidden: true, hash: "delete" })
          )
        )
      )
    );
  }
}

_ConversationHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  subject: PropTypes.string.isRequired,
  msgData: PropTypes.array.isRequired,
};

export const ConversationHeader = ReactRedux.connect((state) => {
  return {
    loading: state.summary.loading,
    subject: state.summary.subject,
    msgData: state.messages.msgData,
  };
})(_ConversationHeader);
