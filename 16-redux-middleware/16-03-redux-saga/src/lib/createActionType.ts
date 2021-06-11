export default function createActionType(type: string) {
  return [type, `${type}_SUCCESS`, `${type}_FAILURE`];
}
