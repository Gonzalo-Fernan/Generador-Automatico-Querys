function buildQuery(aliases, dictionary) {
  const selectedColumns = [];
  const tables = new Set();
  const joins = new Map(); // key = tabla origen, value = join info

  aliases.forEach(alias => {
    const entry = dictionary.find(x => x.alias === alias);

    if (!entry) {
      throw new Error(`Alias no encontrado en diccionario: ${alias}`);
    }

    // SELECT
    selectedColumns.push(`${entry.tabla}.${entry.campo} AS [${entry.alias}]`);
    
    // Tablas para FROM
    tables.add(entry.tabla);

    // JOINS
    if (entry.join) {
      const key = `${entry.tabla}->${entry.join.tabla}`;
      joins.set(key, `JOIN ${entry.join.tabla} ON ${entry.join.on}`);
    }
  });

  // Elegir tabla inicial arbitrariamente (o podrías definir una "principal")
  const fromTable = [...tables][0];

  const finalQuery =
`SELECT
  ${selectedColumns.join(",\n  ")}
FROM ${fromTable}
  ${[...joins.values()].join("\n  ")};
`;

  return finalQuery;
}
aliases = ['Nombre del Asegurado', "Número de Póliza"];

const dictionary = [
  {
    "alias": "Nombre del Asegurado",
    "campo": "insuredName",
    "tabla": "policyPeriod",
    "join": {
      "tabla": "policy",
      "on": "policyPeriod.policyId = policy.id"
    }
  },
  {
    "alias": "Número de Póliza",
    "campo": "policyNumber",
    "tabla": "policy",
    "join": {
      "tabla": "account",
      "on": "policy.accountId = account.id"
    }
  }
]

console.log(buildQuery(aliases, dictionary));
