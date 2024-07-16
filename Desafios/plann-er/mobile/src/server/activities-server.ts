import { api } from "./api";

interface ActivityProps {
  id: string;
  occurs_at: string;
  title: string;
}

interface ActivityCreate extends Omit<ActivityProps, "id"> {
  tripId: string;
}

interface ActivityResponse {
  activities: {
    date: string;
    activities: ActivityProps[];
  }[];
}

async function createActivity({ tripId, occurs_at, title }: ActivityCreate) {
  try {
    const { data } = await api.post<{ activityId: string }>(
      `/trips/${tripId}/activity`,
      { occurs_at, title }
    );

    return data;
  } catch (error) {
    throw error;
  }
}

async function getActivitiesByTripId(tripId: string) {
  try {
    const { data } = await api.get<ActivityResponse>(
      `/trips/${tripId}/activity`
    );
    return data.activities;
  } catch (error) {
    throw error;
  }
}

export const activitiesServer = { createActivity, getActivitiesByTripId };
