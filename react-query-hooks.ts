import { useQuery } from "@tanstack/react-query"
import axios from "axios"


const fetchAvailabilityZones = async (placedate: string, place: string) => {
  const response = await axios.post(`/server/api/availability_zones`, {
    placedate: placedate,
    place: place,
  });

  if (response.status !== 200) {
    throw new Error("Network response was not ok");
  }

  return response.data;
};

export const useGetAvailabilityZones = (placedate: string, place: string) => {
  return useQuery({
    queryKey: ["availabilityZones", placedate, place],
    queryFn: () => fetchAvailabilityZones(placedate, place),

    refetchInterval: 30000,
  });
};
