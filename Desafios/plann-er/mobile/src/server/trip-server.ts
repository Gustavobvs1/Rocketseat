import { api } from "./api";

export interface TripDetailsProps {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

interface TripCreateProps
  extends Omit<TripDetailsProps, "id" | "is_confirmed"> {
  emails_to_invite: string[];
}

async function getTripById(tripId: string) {
  try {
    const { data } = await api.get<{ trip: TripDetailsProps }>(
      `/trips/${tripId}`
    );
    return data.trip;
  } catch (error) {
    throw error;
  }
}

async function createTrip({
  ends_at,
  destination,
  starts_at,
  emails_to_invite,
}: TripCreateProps) {
  try {
    const response = await api.post<{ tripId: string }>("/trips", {
      destination,
      emails_to_invite,
      ends_at,
      starts_at,
      owner_name: "MArilene",
      owner_email: "PAdad@gmail.com",
    });
    console.log(response);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

async function updateTrip({
  id,
  destination,
  starts_at,
  ends_at,
}: Omit<TripDetailsProps, "is_confirmed">) {
  try {
    await api.put(`/trips/${id}`, {
      destination,
      starts_at,
      ends_at,
    });
  } catch (error) {
    throw error;
  }
}

export const tripServer = { getTripById, createTrip, updateTrip };
