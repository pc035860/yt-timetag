# TimeTags for YouTube

Available on

- Chrome Web Store [https://chrome.google.com/webstore/detail/hpbmedimnlknflpbgfbllklgelbnelef](https://chrome.google.com/webstore/detail/hpbmedimnlknflpbgfbllklgelbnelef)
- Firefox Add-ons [https://addons.mozilla.org/en-US/firefox/addon/timetags-for-youtube/](https://addons.mozilla.org/en-US/firefox/addon/timetags-for-youtube/)


We all know that YouTube has a feature that you can tag(bookmark) any specific time of the current video with a video timestamp format like `11:25` in comments.

I found that when you try to create lots of tags for a longer-duration video, it's pretty annoying to write down the tag manually (in text editors like notepad). You have to switch back and forth between different apps. And it's even more annoying when you try to ensure the tagged time is accurate and precise.

So I created this extension to help me solve the problem. Now I can pretty much use just keyboard to add and adjust tags right in the YouTube interface.

Feedbacks are welcome.


# Usage

Browse to any YouTube video, click the icon of the extension in browser bar to activate it.

## Shortcuts

**Shortcuts wouldn't work when YouTube's bulit-in shortcuts is active (which means your focus is currently on the video element).**

| Shortcut              | Action                    | Apply to active tag |
|-----------------------|---------------------------|---------------------|
| `space`               | Pause / Play              |                     |
| `a`                   | Add a tag at current time |                     |
| `esc`                 | Unselect active tag       |                     |
| `delete`, `backspace` | Remove active tag         | ✓                   |
| `left`                | Backward 5 seconds        | ✓                   |
| `alt+left`            | Backward 1 second         | ✓                   |
| `right`               | Forward 5 seconds         | ✓                   |
| `alt+right`           | Forward 1 second          | ✓                   |
| `/`, `d`              | Edit description          | ✓                   |


## Storage

Tags are currently saved locally in your computer.

## Export & Import

To export, click on the "printer" icon.

Results will be copied to your clipboard, in the format:

```
{tag 1} {description 1}
{tag 2} {description 2}
.
.
{tag N} {description N}
```

To import, click on the button next to "add" button.

**Import shares the exact same format with export.**


# Changelog

## 1.4.5

- Remove unnecessary site `permissions` specified for Firefox support in Chrome build

## 1.4.4

- Fix "sync" feature recent videos ordering bug
- Optimize sync compression performance (UX)
- Refine tag description display in different container widths

## 1.4.3

- Add `chrome.storage.local` as primary storage option
- "Sync" feature of Chrome
  - Now syncs recently updated 100 videos only
  - Compress `chrome.storage.sync` data to better utilize the quota (100kB max)
- Store video id, video title information for upcoming features

## 1.4.2

- Firefox support

## 1.4.0

- Export in Markdown format
- CommentList UI: add time tags in comments to your collection

## 1.3.2

- Fix youtube player retrieve issue

## 1.3.1

- Fix spacebar shortcut issue

## 1.3.0

- Fix time tag display issue
- Support Dark Mode

## 1.2.0

- Remove "tabs" permission
- Default to sync storage of Chrome
- Add shortcut for "remove"
- Update for new YouTube design component change

## 1.1.0

- Support new YouTube design
- Tag list will become scrollable when it feels overwhemled
- Add keyboard shortcut `d` for editing active tag description, due to `/` is already used by the new YouTube

## 1.0.0
Add "import" function.

## 0.0.1
First release.
