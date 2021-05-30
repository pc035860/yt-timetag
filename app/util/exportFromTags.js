import { toTag } from './ytTime';

export default function exportFromTags(tags, splitter = '\n') {
  return tags
    .map((tag) => `${toTag(tag.seconds)} ${tag.description}`)
    .join(splitter);
}

export const asMarkdown = (tags, videoId) =>
  tags
    .map(({ seconds, description }) => {
      const tag = toTag(seconds);
      const integerSeconds = Math.floor(seconds);
      const url = `https://youtu.be/${videoId}?t=${integerSeconds}`;
      return `[${tag}](${url}) ${description}`;
    })
    .join('\n');
