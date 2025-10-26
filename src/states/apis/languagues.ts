import { useQuery } from "@tanstack/react-query";

export type Language = {
    key: string;
    name: string;
    nativeName: string;
}

export const useGetLanguages = () => {
  const clientsQueryResult = useQuery<Language[]>({
    queryKey: ["languages"],
    queryFn: async () => {
        const response = await fetch("/resources/langs.json");
        const data = await response.json();
        return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return clientsQueryResult;
};
