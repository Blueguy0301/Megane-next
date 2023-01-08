type props = {
  size: "small" | "medium" | "large";
};
export default function Loading(props: props) {
  const {size} = props;
  if (size === "small") {
    return <h1>Loading small</h1>;
  }
  if (size === "medium") {
    return <h1>Loading medium</h1>;
  }
  if (size === "large") {
    return <h1>Loading large</h1>;
  }
  return <h1>Loading</h1>;
}
