// src/pages/ProductInventory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown, Plus, X, ImageIcon, Trash2, Edit2 } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Product {
    id?: number;
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
            className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none ${className}`}
            onClick={() => onSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <span className="ml-1">
                    {isActive ? (
                        isAsc ? <ChevronUp className="w-3 h-3 text-orange-400" /> : <ChevronDown className="w-3 h-3 text-orange-400" />
                    ) : (
                        <ChevronUp className="w-3 h-3 text-gray-500" />
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

    const [newProduct, setNewProduct] = useState<Product>({
        name: '',
        brand: '',
        barcode: '',
        unit: '',
        unitQuantity: 1,
        salePrice: 0,
        purchasePrice: 0,
        currentStock: 0,
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            const payload = { ...selectedProduct };
            const res = await axios.put(`${apiUrl}/products/${selectedProduct.id}`, payload);
            setProducts(products.map(p => (p.id === res.data.id ? res.data : p)));
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update product.');
        }
    };

    const handleSaveProduct = async () => {
        try {
            const payload = {
                name: newProduct.name,
                brand: newProduct.brand,
                barcode: newProduct.barcode,
                unit: newProduct.unit,
                unit_quantity: newProduct.unitQuantity,
                selling_price: newProduct.salePrice,
                purchase_price: newProduct.purchasePrice,
                current_stock: newProduct.currentStock,
            };
            const response = await axios.post(`${apiUrl}/products`, payload);
            setProducts([...products, response.data]);
            setIsAddModalOpen(false);
            setNewProduct({
                name: '',
                brand: '',
                barcode: '',
                unit: '',
                unitQuantity: 1,
                salePrice: 0,
                purchasePrice: 0,
                currentStock: 0,
            });
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-300">Loading products...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            {/* Shop Name */}
            <h1 className="text-4xl font-bold text-center mb-6 text-orange-500">My Shop Name</h1>

            {/* Search & Add Product */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 text-white font-semibold"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`px-4 py-1 rounded-lg border ${selectedCategory === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-700 text-white border-gray-600'}`}
                        onClick={() => {
                            setSelectedCategory(selectedCategory === cat ? null : cat);
                            setCurrentPage(1);
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">Image</th>
                                <TableHeader label="Product Name" sortKey="name" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Brand" sortKey="brand" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Barcode" sortKey="barcode" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Unit Qty" sortKey="unitQuantity" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Unit" sortKey="unit" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Sale Price" sortKey="salePrice" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Purchase Price" sortKey="purchasePrice" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                                <TableHeader label="Stock" sortKey="currentStock" currentSort={sortConfig} onSort={sortProducts} className="text-orange-500" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedProducts.map(product => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-700 cursor-pointer text-sm"
                                    onClick={() => openProductModal(product)}
                                >
                                    <td className="px-4 py-2">
                                        <img
                                            src={product.imageUrls?.[0] || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="w-10 h-10 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.brand}</td>
                                    <td className="px-4 py-2">{product.barcode}</td>
                                    <td className="px-4 py-2">{product.unitQuantity}</td>
                                    <td className="px-4 py-2">{product.unit}</td>
                                    <td className="px-4 py-2">{product.salePrice}</td>
                                    <td className="px-4 py-2">{product.purchasePrice}</td>
                                    <td className="px-4 py-2">{product.currentStock}</td>
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
                        className={`px-3 py-1 rounded ${currentPage === num ? 'bg-orange-500 text-white' : 'bg-gray-800 text-white border border-gray-700'}`}
                        onClick={() => setCurrentPage(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Edit Product Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-white">
                        <button className="absolute top-3 right-3 text-gray-300 hover:text-white" onClick={() => setIsModalOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-orange-400">Edit Product</h2>
                        <div className="space-y-2">
                            {['name', 'brand', 'barcode', 'unit'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={field}
                                    value={(selectedProduct as any)[field]}
                                    onChange={e => setSelectedProduct({ ...selectedProduct, [field]: e.target.value })}
                                    className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                                />
                            ))}
                            <input
                                type="number"
                                placeholder="Unit Quantity"
                                value={selectedProduct.unitQuantity}
                                onChange={e => setSelectedProduct({ ...selectedProduct, unitQuantity: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Selling Price"
                                value={selectedProduct.salePrice}
                                onChange={e => setSelectedProduct({ ...selectedProduct, salePrice: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Purchase Price"
                                value={selectedProduct.purchasePrice}
                                onChange={e => setSelectedProduct({ ...selectedProduct, purchasePrice: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Current Stock"
                                value={selectedProduct.currentStock}
                                onChange={e => setSelectedProduct({ ...selectedProduct, currentStock: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <div className="flex gap-2 mt-3">
                                <button onClick={handleUpdate} className="flex-1 bg-orange-500 text-white py-1 rounded-md hover:bg-orange-600 flex items-center justify-center gap-2 text-sm">
                                    <Edit2 className="w-4 h-4" /> Update
                                </button>
                                <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-1 rounded-md hover:bg-red-700 flex items-center justify-center gap-2 text-sm">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-white">
                        <button className="absolute top-3 right-3 text-gray-300 hover:text-white" onClick={() => setIsAddModalOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-orange-400">Add Product</h2>
                        <div className="space-y-2">
                            {['name', 'brand', 'barcode', 'unit'].map(field => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={field}
                                    value={(newProduct as any)[field]}
                                    onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })}
                                    className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                                />
                            ))}
                            <input
                                type="number"
                                placeholder="Unit Quantity"
                                value={newProduct.unitQuantity}
                                onChange={e => setNewProduct({ ...newProduct, unitQuantity: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Selling Price"
                                value={newProduct.salePrice}
                                onChange={e => setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Purchase Price"
                                value={newProduct.purchasePrice}
                                onChange={e => setNewProduct({ ...newProduct, purchasePrice: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Current Stock"
                                value={newProduct.currentStock}
                                onChange={e => setNewProduct({ ...newProduct, currentStock: Number(e.target.value) })}
                                className="w-full border border-gray-700 rounded-md px-3 py-1 bg-gray-900 text-white"
                            />

                            <button
                                onClick={handleSaveProduct}
                                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 mt-3 font-semibold"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInventory;
