// src/pages/ProductInventory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown, ImageIcon, Plus, X } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// --- Interface Definitions ---
interface Product {
    id: number;
    name: string;
    brand: string;
    barcode: string;
    unitQuantity: number;
    unit: string;
    salePrice: number;
    currentStock: number;
    remark?: string;
    imageUrls?: string[];
    category?: string;
    subcategory?: string;
    description?: string;
}

// --- Table Header Component ---
interface TableHeaderProps {
    label: string;
    sortKey: keyof Product;
    currentSort: { key: keyof Product; direction: 'asc' | 'desc' };
    onSort: (key: keyof Product) => void;
    className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ label, sortKey, currentSort, onSort, className = '' }) => {
    const isActive = currentSort.key === sortKey;
    const isAsc = currentSort.direction === 'asc';

    return (
        <th
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none ${className}`}
            onClick={() => onSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <span className="ml-1">
                    {isActive ? (
                        isAsc ? <ChevronUp className="w-3 h-3 text-gray-700" /> : <ChevronDown className="w-3 h-3 text-gray-700" />
                    ) : (
                        <ChevronUp className="w-3 h-3 text-gray-300" />
                    )}
                </span>
            </div>
        </th>
    );
};

// --- Main Component ---
const ProductInventory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // 🔥 Modal state
    const [newProduct, setNewProduct] = useState({
        name: '',
        brand: '',
        barcode: '',
        unit: '',
        unitQuantity: 1,
        sellingPrice: 0,
        purchasePrice: 0,
        currentStock: 0,
    });

    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc',
    });

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>(`${apiUrl}/products`);
                setProducts(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch products from server.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Sorting
    const sortProducts = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...products].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
        setProducts(sorted);
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return Object.values(product).some(value => 
            (typeof value === 'string' || typeof value === 'number') && String(value).toLowerCase().includes(term)
        );
    });

    // 🔥 Add new product to DB
    const handleSaveProduct = async () => {
        try {
            const payload = {
                name: newProduct.name,
                brand: newProduct.brand,
                barcode: newProduct.barcode,
                unit: newProduct.unit,
                unit_quantity: newProduct.unitQuantity,
                selling_price: newProduct.sellingPrice,
                purchase_price: newProduct.purchasePrice,
                current_stock: newProduct.currentStock
            };

            const response = await axios.post(`${apiUrl}/products`, payload);
            setProducts([...products, response.data]);
            setIsModalOpen(false);
            setNewProduct({
                name: '',
                brand: '',
                barcode: '',
                unit: '',
                unitQuantity: 1,
                sellingPrice: 0,
                purchasePrice: 0,
                currentStock: 0,
            });
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product');
        }
    };

    const headers = [
        { label: "Product Name", key: "name" as keyof Product },
        { label: "Brand", key: "brand" as keyof Product },
        { label: "Barcode", key: "barcode" as keyof Product },
        { label: "Unit Qty", key: "unitQuantity" as keyof Product },
        { label: "Unit", key: "unit" as keyof Product },
        { label: "Sale Price", key: "salePrice" as keyof Product },
        { label: "Stock", key: "currentStock" as keyof Product },
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Inventory</h1>

            {/* Search & Add */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {headers.map(header => (
                                    <TableHeader
                                        key={header.key}
                                        label={header.label}
                                        sortKey={header.key}
                                        currentSort={sortConfig}
                                        onSort={sortProducts}
                                    />
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4">{product.name}</td>
                                    <td className="px-6 py-4">{product.brand}</td>
                                    <td className="px-6 py-4">{product.barcode}</td>
                                    <td className="px-6 py-4">{product.unitQuantity}</td>
                                    <td className="px-6 py-4">{product.unit}</td>
                                    <td className="px-6 py-4">{product.salePrice}</td>
                                    <td className="px-6 py-4">{product.currentStock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 Modal for Add Product */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                        <div className="space-y-3">
                            {[
                                { name: 'name', label: 'Product Name' },
                                { name: 'brand', label: 'Brand' },
                                { name: 'barcode', label: 'Barcode' },
                                { name: 'unit', label: 'Unit' },
                            ].map(field => (
                                <input
                                    key={field.name}
                                    type="text"
                                    placeholder={field.label}
                                    value={(newProduct as any)[field.name]}
                                    onChange={(e) => setNewProduct({ ...newProduct, [field.name]: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            ))}
                            <input
                                type="number"
                                placeholder="Unit Quantity"
                                value={newProduct.unitQuantity}
                                onChange={(e) => setNewProduct({ ...newProduct, unitQuantity: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Selling Price"
                                value={newProduct.sellingPrice}
                                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Purchase Price"
                                value={newProduct.purchasePrice}
                                onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Current Stock"
                                value={newProduct.currentStock}
                                onChange={(e) => setNewProduct({ ...newProduct, currentStock: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <button
                                onClick={handleSaveProduct}
                                className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
                            >
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInventory;
