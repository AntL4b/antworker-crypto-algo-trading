export class ObjectUtils {
  static clean(obj: any): any {
    return Object.keys(obj)
      .filter((k) => obj[k] != null) // Remove undef. and null.
      .reduce(
        (newObj, k) =>
          typeof obj[k] === "object" && !(obj[k] instanceof Date)
            ? { ...newObj, [k]: this.clean(obj[k]) } // Recurse.
            : { ...newObj, [k]: obj[k] }, // Copy value.
        {},
      );
  }
}
