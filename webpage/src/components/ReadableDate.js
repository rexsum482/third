import React from "react";

const ReadableDate = ({ selectedDate }) => {
  console.log(selectedDate);

  // Parse in local time
  const [year, month, day] = selectedDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Note: month is 0-indexed

  console.log(date);

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  console.log(weekday);

  return (
    <div>
      <span>{weekday}</span>
    </div>
  );
};

export default ReadableDate;