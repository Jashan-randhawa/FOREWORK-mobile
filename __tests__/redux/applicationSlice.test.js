import applicationReducer, {
  setAllApplicants,
} from "../../src/redux/applicationSlice";

describe("Redux applicationSlice (TC-REC-006, TC-REC-007)", () => {
  const initialState = {
    applicants: null,
  };

  it("should return initial state when called with unknown action", () => {
    expect(applicationReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("should set applicants data when setAllApplicants is dispatched", () => {
    const mockApplicants = {
      _id: "job_123",
      title: "Mobile Engineer",
      applications: [
        {
          _id: "app_1",
          applicant: { fullname: "Candidate A", email: "cand.a@forework.dev" },
          status: "pending",
        },
        {
          _id: "app_2",
          applicant: { fullname: "Candidate B", email: "cand.b@forework.dev" },
          status: "accepted",
        },
      ],
    };

    const state = applicationReducer(initialState, setAllApplicants(mockApplicants));
    expect(state.applicants).toEqual(mockApplicants);
    expect(state.applicants.applications.length).toBe(2);
    expect(state.applicants.applications[0].applicant.fullname).toBe("Candidate A");
  });
});
