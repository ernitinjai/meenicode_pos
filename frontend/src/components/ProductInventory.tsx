import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus, ImageIcon } from 'lucide-react';

interface Product {
    id: string;
    productName: string;
    brand: string;
    stock: number;
}

const ProductInventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        axios.get<Product[]>(`${apiUrl}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Product Inventory</h1>
            <div className="flex mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-1/2"
                />
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Product Name</th>
                        <th className="border px-4 py-2">Brand</th>
                        <th className="border px-4 py-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id}>
                            <td className="border px-4 py-2">{p.productName}</td>
                            <td className="border px-4 py-2">{p.brand}</td>
                            <td className="border px-4 py-2">{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductInventory;
