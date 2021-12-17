import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

const Providers = (props: PropsWithChildren<any>) => {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
};

export default Providers;
