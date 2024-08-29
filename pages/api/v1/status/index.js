import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;

  const query = `
    SELECT 
      current_setting('server_version') AS server_version
      , current_setting('max_connections') AS max_connections
      , (SELECT sum(numbackends) FROM pg_stat_database WHERE datname = $1) AS used_connections
    ;
  `;
  const result = await database.query({
    text: query,
    values: [databaseName],
  });
  const databaseVersionValue = result.rows[0].server_version;
  const databaseMaxConnectionsValue = Number(result.rows[0].max_connections);
  const databaseOpenedConnectionsValue =
    Number(result.rows[0].used_connections) - 1;
  const body = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  };

  response.status(200).json(body);
}

export default status;
