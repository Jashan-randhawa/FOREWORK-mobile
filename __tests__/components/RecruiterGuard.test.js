import { getRecruiterAccessStatus } from "../../src/components/recruiter/RecruiterGuard";

describe("Component Security Barrier: RecruiterGuard (TC-REC-001, TC-AUTH-002)", () => {
  it("should return LOADING when session verification is in flight", () => {
    const status = getRecruiterAccessStatus(null, true);
    expect(status).toBe("LOADING");

    const statusWithUser = getRecruiterAccessStatus(
      { role: "Recruiter" },
      true
    );
    expect(statusWithUser).toBe("LOADING");
  });

  it("should return UNAUTHENTICATED for guest users without session", () => {
    const status = getRecruiterAccessStatus(null, false);
    expect(status).toBe("UNAUTHENTICATED");
  });

  it("should return ACCESS_DENIED for candidate persona (role: Student)", () => {
    const candidateUser = {
      _id: "user_cand_1",
      fullname: "Candidate User",
      role: "Student",
    };
    const status = getRecruiterAccessStatus(candidateUser, false);
    expect(status).toBe("ACCESS_DENIED");
  });

  it("should return ACCESS_DENIED for any other non-recruiter role", () => {
    const applicantUser = {
      _id: "user_other",
      role: "Applicant",
    };
    const status = getRecruiterAccessStatus(applicantUser, false);
    expect(status).toBe("ACCESS_DENIED");
  });

  it("should return AUTHORIZED exclusively for verified recruiters (role: Recruiter)", () => {
    const recruiterUser = {
      _id: "user_rec_1",
      fullname: "HR Talent Partner",
      role: "Recruiter",
    };
    const status = getRecruiterAccessStatus(recruiterUser, false);
    expect(status).toBe("AUTHORIZED");
  });
});
