# Buttercup Mobile Changelog

## v1.4.3
_2018-08-03_

 * **Bugfix**: (#112) App crashes when certain custom properties are edited or added

## v1.4.2
_2018-07-21_

 * **Bugfix**: (#111) Various Android UI issues

## v1.4.1
_2018-07-18_

 * **Bugfix**: App would crash on some Android phones due to bad gradle config

## v1.4.0
_2018-07-16_

 * **New crypto library** written in Rust
   * **Bugfix**: (#78) Possible tampering error

## v1.3.0
_2018-06-05_

May update:

 * Upgraded archive format for future format support
 * Fixed Android Touch Unlock support

## v1.2.0
_2018-04-07_

Feature release:

 * **Touch unlock** support for iOS and Android
 * Update React-Native to 0.54
 * Minor UI updates

## v1.1.2
_2017-11-01_

Android patch:

 * **Bugfix**: (#64) Using the Android back arrow to leave the app would cause intermittent crashes

## v1.1.1
_2017-10-27_

Patch release to fix some issues:

 * **Bugfix**: (#62) Saving would override remote changes without merging
 * Removed analytics

## v1.1.0
_2017-10-18_

Quick follow-up feature release:

 * Dropbox support
 * Analytics update (session fix)
 * "View-hidden" button for showing password field
 * Home screen face-lift

## v1.0.0
_2017-10-07_

First iOS release. Includes basic functionality:

 * Add/Remove archives
 * Add/Remove groups
 * Add/Remove/Edit entries
 * Connect ownCloud/Nextcloud/WebDAV archives (no Dropbox support yet)
 * Open entries in Safari (with password copied)
 * Auto-lock after 10 minutes of being in background
 * Auto-hide app contents on being moved to background
