function cosineSimilarity(job, applicant) {
  const jobSkills = job.skills || [];
  const userSkills = applicant?.user.skills || [];
  const jobExperience = job.experience || 0;
  const userExperience = applicant.user.experience || 0;

  const fields = ["skills", "experience"];
  const fieldWeights = {
    skills: 0.8,
    experience: 0.5,
  };
  const values = {
    skills: [...jobSkills, ...userSkills],
    experience: [jobExperience, userExperience],
  };

  const matchedSkills = jobSkills.filter((skill) =>
    userSkills.includes(skill)
  ).length;

  const dotProduct = calculateDotProduct(fields, fieldWeights, values);

  const magnitude1 = Math.sqrt(jobExperience ** 2);
  const magnitude2 = Math.sqrt(userExperience ** 2);

  if (magnitude1 === 0 || magnitude2 === 0 || matchedSkills === 0) {
    return {
      similarity: 0,
      matchedSkills,
      status: "rejected",
      reason: "Insufficient skills or empty skill set",
    };
  }

  let similarity = dotProduct / (magnitude1 * magnitude2);
  similarity = Math.min(similarity, 1);
  similarity = isNaN(similarity) ? 0 : similarity;

  if (similarity <= 0.07) {
    return {
      similarity,
      matchedSkills,
      status: "rejected",
      reason: "Low similarity score",
    };
  } else if (userSkills.length >= jobSkills.length) {
    return {
      similarity,
      matchedSkills,
      status: "matched",
      reason: "High similarity score and user has additional skills",
    };
  } else {
    return {
      similarity,
      matchedSkills,
      status: "shortlisted",
      reason: "High similarity score",
    };
  }
}

function calculateDotProduct(fields, fieldWeights, values) {
  let dotProduct = 0;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const fieldWeight = fieldWeights[field];
    const fieldValues = values[field];

    if (field === "skills") {
      const matchedSkills = fieldValues.filter((skill) =>
        values["skills"].includes(skill)
      );
      dotProduct += fieldWeight * matchedSkills.length;
    } else {
      const jobValue = fieldValues[0].toString();
      const userValue = fieldValues[1].toString();
      const fieldValueMatch = jobValue === userValue ? 1 : 0;
      dotProduct += fieldWeight * fieldValueMatch;
    }
  }
  return dotProduct;
}

module.exports = {
  cosineSimilarity,
};

