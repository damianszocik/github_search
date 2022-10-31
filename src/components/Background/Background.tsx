export const Background = () => (
  <div
    className="absolute w-full h-full -z-10"
    style={{
      backgroundColor: "#e5e5f7",
      opacity: "0.7",
      backgroundImage:
        "repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #c7caff55, #c7caff )",
    }}
  />
);
