import AvailabilityItem from "../availabity-items/AvailabilityItem"
import styled from "styled-components"
import { useContext } from "react"
import { GlobalContext, ZoneDate } from "@/app/ContextProvider";

//--------------------------------------------------------------------

const ListWrapper = styled.div`
  overflow: hidden;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  transition: margin-top 0.2s ease;
  width: 100%;
  height: 100%;
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
  overflow-y: auto;
`;

const EmptyMessageContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

//--------------------------------------------------------------------

const Container = () => {
  const { zoneDates } = useContext(GlobalContext);

  return (
    <ListWrapper>
      <ListContainer>
        {!zoneDates.length && (
          <EmptyMessageContainer>
            <span
              style={{
                color: "#ff5454",
              }}
            >
              <span>
                Make a date and site selection and click <b>Submit</b>
              </span>
            </span>
          </EmptyMessageContainer>
        )}
        {zoneDates.map((zoneDate: ZoneDate) => (
          <AvailabilityItem
            key={`${zoneDate.placedate}-${zoneDate.place}`}
            placedate={zoneDate.placedate}
            place={zoneDate.place}
          />
        ))}
      </ListContainer>
    </ListWrapper>
  );
};

export default Container
