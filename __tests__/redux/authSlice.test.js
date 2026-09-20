import authReducer, {
  setLoading,
  setUser,
  authSliceReducer,
} from "../../src/redux/authSlice";

describe("Redux authSlice (TC-AUTH-003, TC-AUTH-004, TC-AUTH-006)", () => {
  const initialState = {
    loading: false,
    user: null,
  };

  it("should return the initial state when called with an unknown action", () => {
    expect(authReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
  });

  it("should update loading state with setLoading action", () => {
    const state = authReducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
    expect(state.user).toBeNull();

    const stateDone = authReducer(state, setLoading(false));
    expect(stateDone.loading).toBe(false);
  });

  it("should hydrate user profile upon successful login (Candidate persona)", () => {
    const candidateUser = {
      _id: "user_cand_123",
      fullname: "Jashan Singh",
      email: "candidate.test@forework.dev",
      role: "Student",
      phoneNumber: 9876543210,
      profile: {
        skills: ["React Native", "TypeScript", "Node.js"],
        resume: "https://res.cloudinary.com/demo/resume.pdf",
        resumeOriginalName: "Jashan_Resume.pdf",
      },
    };

    const nextState = authReducer(initialState, setUser(candidateUser));
    expect(nextState.user).toEqual(candidateUser);
    expect(nextState.user.role).toBe("Student");
    expect(nextState.user.profile.skills).toContain("React Native");
  });

  it("should hydrate user profile upon recruiter login (Recruiter persona)", () => {
    const recruiterUser = {
      _id: "user_rec_456",
      fullname: "Tech Recruiter",
      email: "recruiter.test@forework.dev",
      role: "Recruiter",
      phoneNumber: 9123456780,
    };

    const nextState = authReducer(initialState, setUser(recruiterUser));
    expect(nextState.user).toEqual(recruiterUser);
    expect(nextState.user.role).toBe("Recruiter");
  });

  it("should clear user session on logout (setUser(null))", () => {
    const loggedInState = {
      loading: false,
      user: { _id: "user_123", email: "user@forework.dev" },
    };

    const loggedOutState = authReducer(loggedInState, setUser(null));
    expect(loggedOutState.user).toBeNull();
  });

  it("should export authSliceReducer identical to default reducer export", () => {
    expect(authSliceReducer).toBe(authReducer);
  });
});
