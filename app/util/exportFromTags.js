import { toTag } from './ytTime';

export default function exportFromTags(tags, splitter = '\n') {
  return tags.map(tag => `${toTag(tag.seconds)} ${tag.description}`).join(splitter);
}
