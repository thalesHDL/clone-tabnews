test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.version).toBeDefined();
  // TODO : regex para verificar padrão de versao valido

  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  // expect(responseBodyDatabase.max_connections).toBeGreaterThan(0);
  expect(responseBody.dependencies.database.max_connections).toBe(100);

  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  // expect(responseBodyDatabase.opened_connections).toBeGreaterThan(0);
  expect(responseBody.dependencies.database.opened_connections).toBe(0);

  delete responseBody.dependencies.database.version;
  delete responseBody.dependencies.database.max_connections;
  delete responseBody.dependencies.database.opened_connections;

  expect(Object.keys(responseBody.dependencies.database).length).toBe(0);

  delete responseBody.dependencies.database;

  expect(Object.keys(responseBody.dependencies).length).toBe(0);

  delete responseBody.dependencies;
  delete responseBody.updated_at;

  expect(Object.keys(responseBody).length).toBe(0);

  // delete responseBody.updated_at;
});
