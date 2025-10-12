// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { LayoutDashboard, Users, ShoppingBag, BookOpen, LogIn, TrendingUp, DollarSign, IndianRupeeIcon } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// --- Type Definitions ---

interface Metric {
    title: string;
    value: string;
    change: string;
    color: string;
    icon: React.ElementType; // Type for Lucide Icon components
    bgColor: string;
}

interface NavLinkProps {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    path?: string;
}

interface PieData {
    name: string;
    value: number;
    color: string;
}

interface BarData {
    name: string;
    'Team A': number;
    'Team B': number;
}


// --- Placeholder Data ---

const keyMetrics: Metric[] = [
    { title: "Day Sales", value: "714K", change: "+2.6%", color: "text-blue-500", icon: IndianRupeeIcon, bgColor: "bg-blue-100/30" },
    { title: "Week Sales", value: "1.35M", change: "-0.1%", color: "text-purple-500", icon: IndianRupeeIcon, bgColor: "bg-purple-100/30" },
    { title: "Total Inventory", value: "1.72M", change: "+2.8%", color: "text-yellow-500", icon: ShoppingBag, bgColor: "bg-yellow-100/30" },
    { title: "Credit", value: "234", change: "+3.6%", color: "text-red-500", icon: IndianRupeeIcon, bgColor: "bg-red-100/30" },
];

// Pie Chart Data (Product Sale Category)
const pieData: PieData[] = [
    { name: 'Category A (43.8%)', value: 43.8, color: '#2563EB' }, // Blue
    { name: 'Category B (31.3%)', value: 31.3, color: '#FCD34D' },    // Yellow
    { name: 'Category C (18.8%)', value: 18.8, color: '#EF4444' },      // Red
    { name: 'Category D (6.3%)', value: 6.3, color: '#10B981' },       // Green
];
const COLORS = pieData.map(d => d.color);

// Bar Chart Data (Monthly Sale - Jan through Dec)
const barData: BarData[] = [
    { name: 'Jan', 'Team A': 40, 'Team B': 30 },
    { name: 'Feb', 'Team A': 65, 'Team B': 70 },
    { name: 'Mar', 'Team A': 45, 'Team B': 20 },
    { name: 'Apr', 'Team A': 65, 'Team B': 40 },
    { name: 'May', 'Team A': 58, 'Team B': 38 },
    { name: 'Jun', 'Team A': 68, 'Team B': 35 },
    { name: 'Jul', 'Team A': 30, 'Team B': 40 },
    { name: 'Aug', 'Team A': 25, 'Team B': 70 },
    { name: 'Sep', 'Team A': 68, 'Team B': 25 },
    { name: 'Oct', 'Team A': 40, 'Team B': 60 },
    { name: 'Nov', 'Team A': 50, 'Team B': 45 },
    { name: 'Dec', 'Team A': 60, 'Team B': 55 },
];


// --- Sub-Components ---

const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, label, isActive, path }) => {
    const content = <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
        }`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </div>

    if (path) {
        return (
            <Link to={path}>
                {content}
            </Link>
        );
    }
    return content;

}

const MetricCard: React.FC<Metric> = ({ title, value, change, color, icon: Icon, bgColor }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
            {/* Icon Circle */}
            <div className={`p-2 rounded-full ${bgColor} ${color.replace('text-', 'text-')}`}>
                <Icon className="w-5 h-5" />
            </div>
            {/* Change Percentage */}
            <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </p>
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
    </div>
);

// --- Main Component ---

const Dashboard: React.FC = () => {
    const location = useLocation();
    const shop = location.state?.shop || JSON.parse(localStorage.getItem("shopInfo") || "{}").shop || {};

    console.log("🧾 Final Shop object:", shop);
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* 1. Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                {/* Team Info */}
                <div className="flex items-start space-x-3 mb-8 p-4 bg-white rounded-xl shadow-sm">
                    {/* Shop Icon */}
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    </div>

                    {/* Shop Details (stacked vertically) */}
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-gray-800">{shop.shopName || "Shop"}</span>
                        <span className="text-sm text-gray-700">{shop.ownerName}</span>
                        <span className="text-sm text-gray-600">{shop.shopCategory}</span>
                        <span className="text-sm text-gray-500">{shop.address}</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                    <NavLink icon={LayoutDashboard} label="Dashboard" isActive={true} />
                    <NavLink icon={Users} label="Customer" isActive={false} />
                    <NavLink icon={ShoppingBag} label="Products" isActive={false} path="/inventory" />
                    <NavLink icon={BookOpen} label="Blog" isActive={false} />
                </div>


            </div>

            {/* 2. Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Key Metrics/Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {keyMetrics.map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Pie Chart: Product Sale Category */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-[400px]">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Sale Category</h2>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={({ name }) => name} // Use the name which includes percentage
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart: Monthly Sale (Jan - Dec) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm h-[400px]">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sale (+43% than last year)</h2>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                                    formatter={(value: number | string) => `${value}M`}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="Team A" fill="#2563EB" name="Team A" />
                                <Bar dataKey="Team B" fill="#FCD34D" name="Team B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;