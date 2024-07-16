import { api } from "./api";

export interface LinkProps {
  id: string;
  title: string;
  url: string;
}

interface LinkCreate extends Omit<LinkProps, "id"> {
  tripId: string;
}

async function getLinksByTripId(tripId: string) {
  try {
    const { data } = await api.get<{ links: LinkProps[] }>(
      `/trips/${tripId}/links`
    );
    return data.links;
  } catch (error) {
    throw error;
  }
}

async function createLink({ tripId, title, url }: LinkCreate) {
  try {
    const { data } = await api.post<{ linkId: string }>(
      `/trips/${tripId}/links`,
      { title, url }
    );

    return data;
  } catch (error) {
    throw error;
  }
}

export const linksServer = { getLinksByTripId, createLink };
