const PROFILE_API_URL = "/api/profile";

async function parseResponse(response: Response) {
  const result = await response.json();

  if (!response.ok || !result.success) {
    const message =
      result.errors?.join("\n") || result.message || "Profile request failed.";

    throw new Error(message);
  }

  return result;
}

export async function getProfiles() {
  const response = await fetch(PROFILE_API_URL);
  return parseResponse(response);
}

export async function createProfile(payload: {
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  experience: string;
}) {
  const response = await fetch(PROFILE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateProfile(payload: {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  experience: string;
}) {
  const response = await fetch(PROFILE_API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteProfile(id: number) {
  const response = await fetch(PROFILE_API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  return parseResponse(response);
}
