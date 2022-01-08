import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const client = new QueryClient();

const Providers = (props: PropsWithChildren<any>) => {
  return (
    <QueryClientProvider client={client}>
      {props.children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Providers;
