import companyReducer, {
  setSingleCompany,
  setCompanies,
  setSearchCompanyByText,
} from "../../src/redux/companySlice";

describe("Redux companySlice (TC-REC-001, TC-REC-003)", () => {
  const initialState = {
    singleCompany: {},
    companies: [],
    searchCompanyByText: "",
  };

  it("should return the default state", () => {
    expect(companyReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("should populate company list with setCompanies", () => {
    const mockCompanies = [
      { _id: "comp_1", name: "Acme Corp", location: "Bangalore" },
      { _id: "comp_2", name: "Initech", location: "Remote" },
    ];
    const state = companyReducer(initialState, setCompanies(mockCompanies));
    expect(state.companies.length).toBe(2);
    expect(state.companies[0].name).toBe("Acme Corp");
  });

  it("should set active singleCompany details", () => {
    const company = {
      _id: "comp_1",
      name: "Acme Corp",
      description: "Cloud computing and mobile tooling",
      website: "https://acme.dev",
    };
    const state = companyReducer(initialState, setSingleCompany(company));
    expect(state.singleCompany).toEqual(company);
  });

  it("should update company search query text", () => {
    const state = companyReducer(initialState, setSearchCompanyByText("Acme"));
    expect(state.searchCompanyByText).toBe("Acme");
  });
});
