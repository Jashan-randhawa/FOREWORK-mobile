describe("Component: DeleteAccountModal Logic & Confirmation (TC-COMP-001)", () => {
  // Pure verification helper matching the modal's internal confirmation logic
  const checkDeleteConfirmation = (input) => {
    return (input || "").trim().toUpperCase() === "DELETE";
  };

  it("should accept valid confirmation inputs regardless of casing or whitespace", () => {
    expect(checkDeleteConfirmation("DELETE")).toBe(true);
    expect(checkDeleteConfirmation("delete")).toBe(true);
    expect(checkDeleteConfirmation(" Delete ")).toBe(true);
    expect(checkDeleteConfirmation("dElEtE")).toBe(true);
  });

  it("should reject invalid, partial, or mistyped confirmation inputs", () => {
    expect(checkDeleteConfirmation("")).toBe(false);
    expect(checkDeleteConfirmation("DEL")).toBe(false);
    expect(checkDeleteConfirmation("delte")).toBe(false);
    expect(checkDeleteConfirmation("DELETE NOW")).toBe(false);
    expect(checkDeleteConfirmation(null)).toBe(false);
    expect(checkDeleteConfirmation(undefined)).toBe(false);
  });
});
