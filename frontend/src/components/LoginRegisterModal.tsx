// src/components/LoginRegisterModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '@fortawesome/fontawesome-free/css/all.min.css';

// --- Interface Definitions ---
export interface LoginRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: 'login' | 'register';
    onAuthSuccess: () => void; 
}

// --- Styled Components (Theme & Layout) ---
const PRIMARY_ORANGE = '#FF9800';
const DARK_ORANGE = '#E65100';
const BORDER_COLOR = '#DDD';
const DARK_TEXT = '#333';
const LIGHT_TEXT = '#FFF';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: ${LIGHT_TEXT};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    width: 90%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TabNav = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 2px solid ${BORDER_COLOR};
`;

const TabButton = styled.button<{ active: boolean }>`
    flex: 1;
    padding: 12px 0;
    border: none;
    background: transparent;
    font-size: 1.1rem;
    font-weight: bold;
    color: ${({ active }) => (active ? PRIMARY_ORANGE : DARK_TEXT)};
    cursor: pointer;
    border-bottom: 2px solid ${({ active }) => (active ? PRIMARY_ORANGE : 'transparent')};
    transition: all 0.3s ease;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Input = styled.input`
    width: calc(100% - 20px);
    padding: 12px 10px;
    border: 1px solid ${BORDER_COLOR};
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    color: ${DARK_TEXT};      /* <-- fix text color */
    background: ${LIGHT_TEXT}; /* ensure background is light */
    &:focus { border-color: ${PRIMARY_ORANGE}; }
`;

const Select = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid ${BORDER_COLOR};
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    color: ${DARK_TEXT};      /* <-- fix text color */
    background: ${LIGHT_TEXT};
    &:focus { border-color: ${PRIMARY_ORANGE}; }
`;

const ErrorMsg = styled.p`
    color: red;
    font-size: 0.85rem;
    margin: -10px 0 0 5px;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px 0;
    background: ${PRIMARY_ORANGE};
    color: ${LIGHT_TEXT};
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover { background: ${DARK_ORANGE}; }
`;

const MemberStatus = styled.p`
    font-size: 0.95rem;
    color: ${DARK_TEXT};
    margin-top: 20px;
    span {
        color: ${PRIMARY_ORANGE};
        font-weight: bold;
        cursor: pointer;
        &:hover { text-decoration: underline; }
    }
`;

const CloseButton = styled.button`
    width: 100%;
    padding: 10px 0;
    margin-top: 25px;
    background: #F0F2F5;
    color: ${DARK_TEXT};
    border: 1px solid ${BORDER_COLOR};
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    &:hover { background: ${BORDER_COLOR}; }
`;

const ProgressBar = styled.div<{ progress: number }>`
    height: 6px;
    width: 100%;
    background: #eee;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 15px;

    &::after {
        content: '';
        display: block;
        height: 100%;
        width: ${({ progress }) => progress}%;
        background: ${PRIMARY_ORANGE};
        transition: width 0.3s ease;
    }
`;

// --- Component ---
const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({ isOpen, onClose, initialTab, onAuthSuccess }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Registration fields
    const [shopName, setShopName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [shopCategory, setShopCategory] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setEmail('');
            setPassword('');
            setErrors({});
        }
    }, [isOpen, initialTab]);

    const validate = () => {
        const newErrors: any = {};
        if (activeTab === 'register') {
            if (!shopName) newErrors.shopName = "Shop name is required";
            if (!ownerName) newErrors.ownerName = "Owner name is required";
            if (!shopCategory) newErrors.shopCategory = "Select a category";
            if (!email) newErrors.email = "Email is required";
            else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";
            if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
            else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = "Phone must be 10 digits";
            if (!address) newErrors.address = "Address is required";
            if (!password) newErrors.password = "Password is required";
        } else {
            if (!email && !phoneNumber) newErrors.email = "Email or phone is required";
            if (!password) newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (activeTab === 'login') {
            // --- LOGIN FLOW ---
            setLoading(true);
            setProgress(25);
            setErrors({});

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shops/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                setProgress(60);
                const result = await response.json();

                if (result.success) {
                    setProgress(100);
                    await new Promise(r => setTimeout(r, 500));
                    localStorage.setItem("shopInfo", JSON.stringify(result));
                    onAuthSuccess();
                } else {
                    setErrors({ general: result.message || "Invalid email or password" });
                }
            } catch (err: any) {
                setErrors({ general: "Login failed: " + err.message });
            } finally {
                setLoading(false);
                setProgress(0);
            }
        } else {
            // --- REGISTER FLOW ---
            setLoading(true);
            setProgress(20);

            const shopData = {
                shopName,
                ownerName,
                shopCategory,
                email,
                phoneNumber,
                address,
                password
            };

            try {
                setProgress(50);
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shops`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(shopData)
                });
                setProgress(80);

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText || "Failed to register shop");
                }

                setProgress(100);
                await new Promise(r => setTimeout(r, 500));
                alert("Registration successful!");
                onAuthSuccess();
            } catch (err: any) {
                alert("Registration failed: " + err.message);
            } finally {
                setLoading(false);
                setProgress(0);
            }
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <TabNav>
                    <TabButton active={activeTab === 'login'} onClick={() => setActiveTab('login')}>LOGIN</TabButton>
                    <TabButton active={activeTab === 'register'} onClick={() => setActiveTab('register')}>REGISTER</TabButton>
                </TabNav>

                {loading && <ProgressBar progress={progress} />}

                <Form onSubmit={handleFormSubmit}>
                    {activeTab === 'register' && (
                        <>
                            <Input placeholder="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} />
                            {errors.shopName && <ErrorMsg>{errors.shopName}</ErrorMsg>}

                            <Input placeholder="Owner Name" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                            {errors.ownerName && <ErrorMsg>{errors.ownerName}</ErrorMsg>}

                            <Select value={shopCategory} onChange={e => setShopCategory(e.target.value)}>
                                <option value="">Select category</option>
                                <option value="Medical">Medical</option>
                                <option value="General Stall">General Stall</option>
                                <option value="Tea Stall">Tea Stall</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Bakery">Bakery</option>
                                <option value="Stationary">Stationary</option>
                            </Select>
                            {errors.shopCategory && <ErrorMsg>{errors.shopCategory}</ErrorMsg>}
                        </>
                    )}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}

                    {activeTab === 'register' && (
                        <>
                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {errors.phoneNumber && <ErrorMsg>{errors.phoneNumber}</ErrorMsg>}

                            <Input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}
                        </>
                    )}

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}

                    {activeTab === 'login' && errors.general && <ErrorMsg>{errors.general}</ErrorMsg>}

                    <SubmitButton type="submit">
                        {activeTab === 'login' ? 'SIGN IN' : loading ? 'REGISTERING...' : 'REGISTER'}
                    </SubmitButton>
                </Form>

                {activeTab === 'login' && (
                    <MemberStatus>
                        Not a member? <span onClick={() => setActiveTab('register')}>Register</span>
                    </MemberStatus>
                )}

                <CloseButton onClick={onClose}>CLOSE</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default LoginRegisterModal;
