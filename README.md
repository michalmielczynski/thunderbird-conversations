# Thunderbird Conversations (Modernized)

> **🎨 Modernized Fork**: This is a modernized version of the original [Thunderbird Conversations](https://github.com/thunderbird-conversations/thunderbird-conversations) extension, featuring native Thunderbird styling, streamlined interface, and improved user experience for Thunderbird 140+.

## ✨ What's Different in This Fork

This modernized version includes significant improvements over the original:

- **Native Thunderbird Styling**: Seamlessly integrates with Thunderbird's modern interface
- **Quick Filter UI Integration**: Header buttons now match native Thunderbird Quick Filter appearance
- **Streamlined UI**: Removed clutter like QuickReply interface, star buttons, and unnecessary footers
- **Modern Attachment Display**: Compact, clickable attachment cards with unified icons replace large thumbnails
- **Space-Efficient Layout**: Grid-based attachment layout saves significant screen space
- **System Integration**: Uses system accent colors and respects light/dark mode preferences
- **Enhanced UX**: Whole attachment cards are clickable with dedicated download actions
- **Clean Message Display**: Simplified headers and streamlined action buttons
- **Modern Design Language**: Card-based layouts with subtle shadows and smooth animations
- **Reduced Complexity**: Removed legacy theming options that caused display issues

### 🎨 Quick Filter Integration (v4.3.5)

The conversation header has been enhanced to match Thunderbird's native Quick Filter appearance:

- **Native Button Styling**: Header action buttons now use the same visual style as Quick Filter buttons
- **Seamless Integration**: Darker gray backgrounds with sharp, thin borders match native UI
- **Connected Layout**: Buttons group together seamlessly like native Quick Filter controls
- **System Colors**: Maintains system accent color integration for active states
- **Consistent Dimensions**: 26px height matching native Thunderbird button standards

### 🗂️ Attachment Improvements (v4.3.4)

The attachment system has been completely redesigned:

- **Clickable Cards**: Entire attachment area is clickable for opening/previewing files
- **Unified Icons**: Simple, consistent icons replace varied file type thumbnails  
- **Compact Grid**: Multiple attachments display side-by-side in space-efficient cards
- **Smart Text Handling**: Long filenames wrap properly with ellipsis truncation
- **Single Action**: Streamlined download button as the only separate action needed
- **Visual Feedback**: Hover effects and transitions provide clear interaction cues

For a detailed list of changes, see [MODERNIZATION_PROGRESS.md](docs/MODERNIZATION_PROGRESS.md).

## 📧 About Thunderbird Conversations

This extension improves the threaded summary for emails in Thunderbird. It
vastly improves the UI by including some ideas from GMail. More specifically:

- your own messages are displayed in the thread,
- you initially see summaries, they can be expanded to display full messages,
- quoted sections are collapsed à la GMail,
- fast links for replying (and possibly other useful actions).

## 📦 Installation

**Original Extension**: For the original version, visit [AMO](https://addons.thunderbird.net/thunderbird/addon/gmail-conversation-view/)

**This Modernized Version**: Download from the [Releases](https://github.com/michalmielczynski/thunderbird-conversations/releases) page or build from source (see below).

## 🔧 Thunderbird Support

We try to ensure the released version of Conversations supports at least the
latest released Thunderbird version.

Where possible, we also support the previous Thunderbird version, and the latest
Beta's. However, sometimes support may lag, depending on what changes have
recently been made in Thunderbird.

**This modernized version targets Thunderbird 140+** for optimal native styling integration.

## 🛠️ Building, Development and Testing

Please see [Development.md](docs/Development.md) for details.

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

**For the original project**: Visit [thunderbird-conversations/thunderbird-conversations](https://github.com/thunderbird-conversations/thunderbird-conversations)

## 📄 License

Please see [LICENSE](LICENSE).
