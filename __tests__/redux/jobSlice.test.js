import jobReducer, {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilter,
  setSortBy,
  clearFilters,
  setPagination,
} from "../../src/redux/jobSlice";

describe("Redux jobSlice (TC-CAND-001, TC-CAND-002, TC-CAND-004)", () => {
  const initialState = {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    filters: {
      location: "",
      technology: "",
      experienceMin: "",
      experienceMax: "",
      salaryMin: "",
      salaryMax: "",
      jobType: "",
    },
    pagination: {
      page: 1,
      limit: 6,
      total: 0,
      totalPages: 1,
      hasMore: false,
    },
    sortBy: "relevance",
  };

  it("should return the initial state for jobs", () => {
    expect(jobReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("should populate allJobs when fetched", () => {
    const mockJobs = [
      { _id: "job_1", title: "React Native Lead", company: { name: "Google" } },
      { _id: "job_2", title: "Senior Backend Engineer", company: { name: "Meta" } },
    ];
    const state = jobReducer(initialState, setAllJobs(mockJobs));
    expect(state.allJobs.length).toBe(2);
    expect(state.allJobs[0].title).toBe("React Native Lead");
  });

  it("should set singleJob details", () => {
    const mockJob = { _id: "job_100", title: "Fullstack Developer", salary: 25 };
    const state = jobReducer(initialState, setSingleJob(mockJob));
    expect(state.singleJob).toEqual(mockJob);
  });

  it("should update searchedQuery and reset page to 1", () => {
    const customState = {
      ...initialState,
      pagination: { ...initialState.pagination, page: 3 },
    };
    const state = jobReducer(customState, setSearchedQuery("React"));
    expect(state.searchedQuery).toBe("React");
    expect(state.pagination.page).toBe(1);
  });

  it("should update single filter by key-value object and reset pagination page", () => {
    const state = jobReducer(
      initialState,
      setFilter({ key: "location", value: "Bangalore" })
    );
    expect(state.filters.location).toBe("Bangalore");
    expect(state.pagination.page).toBe(1);
  });

  it("should update multiple filters and reset pagination page", () => {
    const state = jobReducer(
      initialState,
      setFilter({ location: "Remote", jobType: "Full-Time" })
    );
    expect(state.filters.location).toBe("Remote");
    expect(state.filters.jobType).toBe("Full-Time");
    expect(state.pagination.page).toBe(1);
  });

  it("should clear all filters and reset query and pagination to defaults", () => {
    const filteredState = {
      ...initialState,
      searchedQuery: "Engineer",
      sortBy: "salary",
      filters: {
        ...initialState.filters,
        location: "Delhi",
        technology: "Node.js",
      },
      pagination: { ...initialState.pagination, page: 4 },
    };

    const state = jobReducer(filteredState, clearFilters());
    expect(state.filters.location).toBe("");
    expect(state.filters.technology).toBe("");
    expect(state.searchedQuery).toBe("");
    expect(state.sortBy).toBe("relevance");
    expect(state.pagination.page).toBe(1);
  });

  it("should update recruiter admin jobs list", () => {
    const adminJobs = [{ _id: "job_admin_1", title: "Staff Architect" }];
    const state = jobReducer(initialState, setAllAdminJobs(adminJobs));
    expect(state.allAdminJobs).toEqual(adminJobs);
  });
});
