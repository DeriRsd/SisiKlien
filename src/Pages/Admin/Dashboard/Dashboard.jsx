import React from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import { useChartData } from "@/Utils/Hooks/useChart";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Dashboard = () => {
  const { data = {}, isLoading } = useChartData();

  const { students = [], genderRatio = [], registrations = [] } = data;

  if (isLoading) {
    return <div className="p-6 text-center">Loading chart data...</div>;
  }

  return (
    <div className="space-y-6">
      <Heading as="h1">Dashboard</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Heading as="h3" className="text-lg mb-4">
            Jumlah Mahasiswa per Fakultas
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={students}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="faculty"
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Jumlah Mahasiswa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Heading as="h3" className="text-lg mb-4">
            Rasio Gender Mahasiswa
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderRatio}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props) => `${props.name} (${props.value})`}
              >
                {genderRatio.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          {" "}
          <Heading as="h3" className="text-lg mb-4">
            Tren Pendaftaran Mahasiswa Baru
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={registrations}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Total Pendaftar"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
