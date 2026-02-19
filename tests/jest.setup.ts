// tests/jest.setup.ts
afterAll(async () => {
  // dá um tick pro event loop limpar quits
  await new Promise((r) => setTimeout(r, 50));

  const handles = (process as any)._getActiveHandles?.() ?? [];
  const requests = (process as any)._getActiveRequests?.() ?? [];

  const clean = (x: any) => x?.constructor?.name ?? "Unknown";

  const filteredHandles = handles
    .map(clean)
    .filter((n: string) => !["WriteStream", "ReadStream"].includes(n));

  console.log("[jest] active handles:", filteredHandles);
  console.log("[jest] active requests:", requests.map(clean));
});

export {};
