// src/pages/ProductInventory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown, ImageIcon, Plus } from 'lucide-react';

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
                        <ChevronUp className="w-3 h-3 text-gray-300" /> // neutral icon
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
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc',
    });

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>(`${apiUrl}/products`);
                const mappedProducts = response.data.map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    barcode: p.barcode,
                    unitQuantity: p.unitQuantity,
                    unit: p.unit,
                    salePrice: Number(p.salePrice),
                    currentStock: p.currentStock,
                    remark: '',
                    imageUrls: [],
                    category: '',
                    subcategory: '',
                    description: ''
                }));
                setProducts(mappedProducts);
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

    // Table Headers
    const headers: { label: string; key: keyof Product; className?: string }[] = [
        { label: "Product Name", key: "name", className: 'w-1/6' },
        { label: "Brand", key: "brand", className: 'w-1/12' },
        { label: "Barcode", key: "barcode", className: 'w-1/12' },
        { label: "Category", key: "category", className: 'w-1/12' },
        { label: "Unit Qty", key: "unitQuantity", className: 'w-1/12 text-right' },
        { label: "Unit", key: "unit", className: 'w-1/12' },
        { label: "Sale Price", key: "salePrice", className: 'w-1/12 text-right' },
        { label: "Stock", key: "currentStock", className: 'w-1/12 text-right' },
        { label: "Remark", key: "remark", className: 'w-1/12' },
        { label: "Images", key: "imageUrls", className: 'w-1/12 text-center' },
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
                        placeholder="Search products, brands, or barcodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                    />
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    onClick={() => console.log('Add New Product')}
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
                                        className={header.className}
                                    />
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product, index) => (
                                <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.barcode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.unitQuantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">${product.salePrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            product.currentStock > 100 ? 'bg-green-100 text-green-800' : 
                                            product.currentStock > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.currentStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.remark || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {product.imageUrls && product.imageUrls.length > 0 ? (
                                            <div className='flex items-center justify-center space-x-1'>
                                                <ImageIcon className='w-4 h-4 text-blue-500'/>
                                                <span className='text-xs font-medium'>({product.imageUrls.length})</span>
                                            </div>
                                        ) : (
                                            <span className='text-gray-400'>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={headers.length} className="px-6 py-10 text-center text-gray-500 text-lg">
                                        No products found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductInventory;
