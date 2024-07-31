"use client"

import { useEffect, useContext } from "react"
import moment from "moment"
import { useGetAvailabilityZones } from "@/react-query-hooks"
import styled from "styled-components"
import CloseIcon from "@mui/icons-material/Close"
import CachedIcon from "@mui/icons-material/Cached"
import NorthIcon from "@mui/icons-material/North"
import SouthIcon from "@mui/icons-material/South"
import { RotatingLines } from "react-loader-spinner"
import { GlobalContext } from "@/app/ContextProvider"
import places from "../../places.json"
import { Slot } from "../server/models";

//--------------------------------------------------------------------

const AvailabilityItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #333;
  flex: 1;

  span {
    font-size: 10px;
    color: #777;
    align-self: flex-start;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const Th = styled.th`
  background-color: #f5f5f5;
  color: #333;
  font-weight: 400;
  text-align: center;
  border: 1px solid #e9ecef;
  font-weight: 600;
  padding: 5px;
`;

const Td = styled.td`
  background-color: #fff;
  color: #333;
  border: 1px solid #e9ecef;
  text-align: center;
  padding: 5px;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 5px;
  flex-wrap: wrap;
  span {
    color: black;
    font-size: 10px;
  }
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: indianred;
  }
`;

//--------------------------------------------------------------------

const AvailabilityItem = ({
  placedate,
  place,
}: {
  placedate: string;
  place: string;
}) => {
  const { triggerRefetch, zoneDates, setZoneDates } = useContext(GlobalContext);
  const placeName = places.find((item) => item.value === place)?.label;

  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
    dataUpdatedAt,
    refetch,
    isRefetching,
  } = useGetAvailabilityZones(placedate, place);
  placedate;

  useEffect(() => {
    refetch();
  }, [triggerRefetch, refetch]);

  if (isLoading) {
    //show loading only on initial load
    return null;
  }

  const formattedDate = moment(placedate).format("DD/MM/YYYY ddd");
  const formattedUpdatedAt = moment(dataUpdatedAt).format(
    "DD/MM/YYYY HH:mm:ss"
  );

  return (
    <AvailabilityItemContainer>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <TopContainer>
          <span
            title={placeName}
            style={{
              color: "dodgerblue",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {placeName}
          </span>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              title={formattedDate}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {formattedDate}
            </span>
            <StyledCloseIcon
              titleAccess="Remove date"
              onClick={() => {
                const updatedZoneDates = zoneDates.filter(
                  (item) =>
                    !(item.placedate === placedate && item.place === place)
                );

                setZoneDates(updatedZoneDates);
              }}
            />
          </div>
        </TopContainer>
        <Table>
          <thead>
            {error ? (
              <tr>
                <Th
                  style={{
                    color: "indianred",
                    border: "none",
                    backgroundColor: "white",
                  }}
                >
                  Error fetching zone
                </Th>
              </tr>
            ) : (
              <tr>
                <Th>Zone</Th>
                <Th>Availability</Th>
              </tr>
            )}
          </thead>
          <tbody>
            {data?.slots?.map((slot: Slot) => {
              const availNumber = slot.avail.toString().replace(/\D/g, "");
              const parsedNumber = parseInt(availNumber, 10);
              const redZone = parsedNumber < 20;
              const isOrangeZone = parsedNumber < 50 && parsedNumber >= 20;
              const shouldShowArrow = slot.availChange !== "neutral";
              const isPositive = slot.availChange === "positive";
              const isNegative = slot.availChange === "negative";
              return (
                <tr key={slot.zone}>
                  <Td>{slot.zone}</Td>
                  <Td
                    style={{
                      color: redZone
                        ? "indianred"
                        : isOrangeZone
                        ? "orange"
                        : "darkgreen",
                      position: "relative",
                    }}
                  >
                    {parsedNumber}
                    {shouldShowArrow && isPositive && (
                      <NorthIcon
                        sx={{
                          fontSize: "12px",
                          color: "darkgreen",
                          position: "absolute",
                          right: "3px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                    {shouldShowArrow && isNegative && (
                      <SouthIcon
                        sx={{
                          fontSize: "12px",
                          color: "indianred",
                          position: "absolute",
                          right: "3px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <BottomContainer>
        {isRefetching ? (
          <div
            style={{
              width: "17px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RotatingLines width="12" strokeColor="black" strokeWidth={"3"} />
          </div>
        ) : (
          <div
            style={{
              width: "17px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CachedIcon
              sx={{
                fontSize: "15px",
                visibility: "hidden",
              }}
            />
          </div>
        )}
        <span title={`Last updated @ ${formattedUpdatedAt}`}>
          {formattedUpdatedAt}
        </span>
        <div
          style={{
            width: "17px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CachedIcon
            titleAccess="Refresh"
            onClick={() => refetch()}
            sx={{
              cursor: "pointer",
              fontSize: "15px",
            }}
          />
        </div>
      </BottomContainer>
    </AvailabilityItemContainer>
  );
};

export default AvailabilityItem
