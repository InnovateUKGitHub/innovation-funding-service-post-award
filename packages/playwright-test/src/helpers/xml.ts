function xml(literals: TemplateStringsArray, ...substs: Array<string>): string {
  let ret = "";

  for (let i = 0; i < Math.max(literals.length, substs.length); i++) {
    const literal = literals[i];
    let subst = substs[i];

    if (literal) {
      ret += literal;
    }
    if (subst) {
      ret += subst
        .replaceAll("&", "&amp;")
        .replaceAll(">", "&gt;")
        .replaceAll("<", "&lt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
        .replaceAll("`", "&#96;");
    }
  }

  ret = ret.trim();

  return ret;
}

export { xml };
