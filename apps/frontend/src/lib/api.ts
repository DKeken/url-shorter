import { type UrlLink } from "@app/database/schema";
import { API_ENDPOINTS, API_URL } from "./constants";
import { handleApiError } from "./error-utils";
import { Analytics, CreateUrlInput } from "../types";

export async function shortenUrl(data: CreateUrlInput): Promise<string> {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.SHORTEN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    throw handleApiError(error, "Failed to create short URL");
  }
}

export async function getUrlInfo(shortCode: string): Promise<UrlLink> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.URL_INFO}/${shortCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error, "Failed to get URL info");
  }
}

export async function deleteUrl(shortCode: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.DELETE_URL}/${shortCode}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw handleApiError(error, "Failed to delete URL");
  }
}

export async function getUrlAnalytics(shortCode: string): Promise<Analytics> {
  try {
    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.URL_ANALYTICS}/${shortCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Map backend DTO to frontend type
    return {
      clickCount: data.visitCount,
      recentVisitors:
        data.recentVisits?.map((visit: { ip: string }) => visit.ip) || [],
    };
  } catch (error) {
    throw handleApiError(error, "Failed to get URL analytics");
  }
}
