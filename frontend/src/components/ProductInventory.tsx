// src/pages/ProductInventory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown, Plus, X, ImageIcon, Trash2, Edit2 } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Product {
    id: number;
    name: string;
    brand: string;
    barcode: string;
    unitQuantity: number;
    unit: string;
    salePrice: number;
    purchasePrice: number;
    currentStock: number;
    category?: string;
    imageUrls?: string[];
}

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

const ProductInventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get<Product[]>(`${apiUrl}/products`);
                setProducts(res.data);
                const uniqueCategories = Array.from(new Set(res.data.map(p => p.category).filter(Boolean))) as string[];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Sorting
    const sortProducts = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });

        const sorted = [...products].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];
            if (typeof aValue === 'string' && typeof bValue === 'string') return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            if (typeof aValue === 'number' && typeof bValue === 'number') return direction === 'asc' ? aValue - bValue : bValue - aValue;
            return 0;
        });
        setProducts(sorted);
    };

    // Filter & search
    const filteredProducts = products
        .filter(p => !selectedCategory || p.category === selectedCategory)
        .filter(product => {
            const term = searchTerm.toLowerCase();
            return Object.values(product).some(value => (typeof value === 'string' || typeof value === 'number') && String(value).toLowerCase().includes(term));
        });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Select product for modal
    const openProductModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await axios.delete(`${apiUrl}/products/${selectedProduct.id}`);
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to delete product.');
        }
    };

    const handleUpdate = async () => {
        if (!selectedProduct) return;
        try {
            const payload = {
                ...selectedProduct
            };
            const res = await axios.put(`${apiUrl}/products/${selectedProduct.id}`, payload);
            setProducts(products.map(p => (p.id === res.data.id ? res.data : p)));
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update product.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading products...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Inventory</h1>

            {/* Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="relative w-full max-w-lg mb-3 md:mb-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`px-3 py-1 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => {
                                setSelectedCategory(selectedCategory === cat ? null : cat);
                                setCurrentPage(1);
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <TableHeader label="Product Name" sortKey="name" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Brand" sortKey="brand" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Barcode" sortKey="barcode" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Unit Qty" sortKey="unitQuantity" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Unit" sortKey="unit" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Sale Price" sortKey="salePrice" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Purchase Price" sortKey="purchasePrice" currentSort={sortConfig} onSort={sortProducts} />
                                <TableHeader label="Stock" sortKey="currentStock" currentSort={sortConfig} onSort={sortProducts} />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => openProductModal(product)}>
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.imageUrls?.[0] || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{product.name}</td>
                                    <td className="px-6 py-4">{product.brand}</td>
                                    <td className="px-6 py-4">{product.barcode}</td>
                                    <td className="px-6 py-4">{product.unitQuantity}</td>
                                    <td className="px-6 py-4">{product.unit}</td>
                                    <td className="px-6 py-4">{product.salePrice}</td>
                                    <td className="px-6 py-4">{product.purchasePrice}</td>
                                    <td className="px-6 py-4">{product.currentStock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                        key={num}
                        className={`px-3 py-1 rounded ${currentPage === num ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                        onClick={() => setCurrentPage(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                        <div className="space-y-3">
                            {['name', 'brand', 'barcode', 'unit'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={field}
                                    value={(selectedProduct as any)[field]}
                                    onChange={e => setSelectedProduct({ ...selectedProduct, [field]: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            ))}
                            <input
                                type="number"
                                placeholder="Unit Quantity"
                                value={selectedProduct.unitQuantity}
                                onChange={e => setSelectedProduct({ ...selectedProduct, unitQuantity: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Selling Price"
                                value={selectedProduct.salePrice}
                                onChange={e => setSelectedProduct({ ...selectedProduct, salePrice: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Purchase Price"
                                value={selectedProduct.purchasePrice}
                                onChange={e => setSelectedProduct({ ...selectedProduct, purchasePrice: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                            <input
                                type="number"
                                placeholder="Current Stock"
                                value={selectedProduct.currentStock}
                                onChange={e => setSelectedProduct({ ...selectedProduct, currentStock: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />

                            <div className="flex gap-2 mt-4">
                                <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Update
                                </button>
                                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInventory;
