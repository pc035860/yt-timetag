import { toTag } from './ytTime';

export default function exportFromTags(tags) {
  return tags.map(tag => `${toTag(tag.seconds)} ${tag.description}`).join('\n');
}
