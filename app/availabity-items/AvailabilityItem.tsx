import "./styles.css";

//--------------------------------------------------------------------

const AvailabilityItem = (availability: { avail: string }) => {
  return (
    <div className="availability-item-container">
      <h2>Availability</h2>
      <p>{availability.avail}</p>
    </div>
  );
};
export default AvailabilityItem;
