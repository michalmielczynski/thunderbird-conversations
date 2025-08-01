/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

export const kCurrentLegacyMigration = 3;

export const kPrefDefaults = {
  hide_quote_length: 5,
  expand_who: 4, // kExpandAuto
  no_friendly_date: false,
  uninstall_infos: "{}",
  logging_enabled: false,
  operate_on_conversations: false,
  extra_attachments: false,
  compose_in_tab: true,
  unwanted_recipients: "{}",
  hide_sigs: false,
  disableBetweenColumn: false,
  migratedLegacy: kCurrentLegacyMigration,
};

/**
 * Handles loading of the preferences, and any migration routines that are
 * necessary.
 */
export class Prefs {
  async init() {
    try {
      await this._migrate();
    } catch (ex) {
      console.error(ex);
    }

    const results = await browser.storage.local.get("preferences");
    if (results.preferences) {
      let updatePrefs = false;
      for (const prefName of Object.getOwnPropertyNames(kPrefDefaults)) {
        // Ensure all preference values are defined.
        if (results.preferences[prefName] === "undefined") {
          updatePrefs = true;
          results.preferences[prefName] = kPrefDefaults[prefName];
        }
      }

      if (updatePrefs) {
        try {
          await browser.storage.local.set({ preferences: results.preferences });
        } catch (ex) {
          console.error(ex);
        }
      }
    } else {
      console.error("Could not find the preferences to send to the API.");
    }
  }

  async _migrate() {
    const results = await browser.storage.local.get("preferences");

    if (!results.preferences) {
      await browser.storage.local.set({ preferences: kPrefDefaults });
      return;
    }

    const currentMigration = results.preferences?.migratedLegacy ?? 0;

    if (currentMigration >= kCurrentLegacyMigration) {
      return;
    }

    let prefs = results.preferences || {};

    // Version 2 was the migration from the legacy storage format for saved
    // quick reply drafts. It might be better just to drop these completely
    // now, but in case we decide to keep & use the old data:
    //
    // Stored in key/value format in draftsData (top-level).
    // The key is the gloda id. The value was generated from this:
    // {
    //   msgUri: msgHdrGetUri(gComposeSession.params.msgHdr),
    //   from: gComposeSession.params.identity.email,
    //   to: JSON.parse($("#to").val()).join(","),
    //   cc: JSON.parse($("#cc").val()).join(","),
    //   bcc: JSON.parse($("#bcc").val()).join(","),
    //   body: getActiveEditor().value,
    //   attachments: gComposeSession.attachmentList.save()
    // }

    if (currentMigration < 3) {
      prefs.hide_quick_reply = false;
    }

    prefs.migratedLegacy = kCurrentLegacyMigration;
    await browser.storage.local.set({ preferences: prefs });
  }
}
