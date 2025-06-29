import { useQuery } from "@tanstack/react-query";
import { getAllChartData } from "@/Utils/Apis/ChartApi";

export const useChartData = () =>
  useQuery({
    queryKey: ["chartData"], 
    queryFn: getAllChartData,
    select: (res) => res.data, 
  });
