export default function DeepCopy(data) {
    if (data === undefined || data === null) {
      return data;
    }
    return JSON.parse(JSON.stringify(data));
  }