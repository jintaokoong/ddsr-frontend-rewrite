import { Fragment, PropsWithChildren } from "react";

const Conditional = ({
  visible,
  alternate,
  children,
}: PropsWithChildren<{ visible: boolean; alternate: JSX.Element }>) => {
  return visible ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Fragment>{alternate}</Fragment>
  );
};

export default Conditional;
