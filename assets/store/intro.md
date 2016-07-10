# Intro

We all know that YouTube has a feature that you can tag(bookmark) any specific time of the current video with a video timestamp format like `11:25` in comments.

I found that when you try to create lots of tags for a longer-duration video, it's pretty annoying to write down the tag manually (in text editors like notepad). You have to switch back and forth between different apps. And it's even more annoying when you try to ensure the tagged time is accurate and precise.

So I created this extension to help me solve the problem. Now I can pretty much use just keyboard to add and adjust tags right in the YouTube interface.

Feedbacks are welcome.


# Usage

Browse to any YouTube video, click the icon of the extension in browser bar to activate it.

## Shortcuts

- [left] backward for 5 seconds (affects active tag)
- [alt+left] backward for 1 second (affects active tag)
- [right] forward for 5 seconds (affects active tag)
- [alt+right] forward for 1 second (affects active tag)
- [space] pause/play
- [a] add a tag at current time
- [/] edit the description of active tag
- [esc] cancel active tag

Shortcuts won't work when YouTube's bulit-in shortcuts is active (which means your focus is currently on the video element).

## Storage

Tags are currently saved locally in your computer.

## Export

Click on the "printer" icon on the UI.

Results will be copied to your clipboard, in the format:

```
{tag 1} {description 1}
{tag 2} {description 2}
.
.
{tag N} {description N}
```


# Changelog

## 0.0.1
First release.
