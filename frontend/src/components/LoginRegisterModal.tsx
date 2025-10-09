// src/components/LoginRegisterModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '@fortawesome/fontawesome-free/css/all.min.css';

// --- Interface Definitions ---
export interface LoginRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab: 'login' | 'register';
    // 💡 NEW PROP: Handler for successful authentication
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

    /* Mobile responsiveness */
    @media (max-width: 600px) {
        width: 95%;
        padding: 15px;
    }
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

    &:hover:not([disabled]) {
        color: ${DARK_ORANGE};
    }
`;

const SocialConnect = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
    p { margin-bottom: 10px; }
`;

const SocialButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const SocialButton = styled.button<{ iconColor: string }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${({ iconColor }) => iconColor};
    background: ${LIGHT_TEXT};
    color: ${({ iconColor }) => iconColor};
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ iconColor }) => iconColor};
        color: ${LIGHT_TEXT};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
`;

const OrSeparator = styled.p`
    /* Styling for the 'or' separator */
    position: relative;
    width: 100%;
    text-align: center;
    margin: 15px 0;
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        border-top: 1px solid ${BORDER_COLOR};
        z-index: 1;
    }
    span {
        background: ${LIGHT_TEXT};
        padding: 0 10px;
        position: relative;
        z-index: 2;
        color: ${BORDER_COLOR};
        font-size: 0.9rem;
    }
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
    transition: border-color 0.3s ease;
    &:focus { border-color: ${PRIMARY_ORANGE}; }
`;

const ForgotPassword = styled.p`
    width: 100%;
    text-align: right;
    margin-top: -5px;
    font-size: 0.9rem;
    a { color: ${PRIMARY_ORANGE}; text-decoration: none; }
    a:hover { text-decoration: underline; }
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
    transition: background-color 0.3s ease;
    &:hover { background: ${BORDER_COLOR}; }
`;

// --- The Functional Component ---
const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({ isOpen, onClose, initialTab, onAuthSuccess }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setEmail('');
            setPassword('');
        }
    }, [isOpen, initialTab]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ⚠️ Placeholder for API call
        if (activeTab === 'login') {
            console.log('Login attempt:', { email, password });
            // Simulate success
            onAuthSuccess(); 
        } else {
            console.log('Register attempt:', { email, password });
            // Simulate success
            onAuthSuccess(); 
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {/* Tab Navigation */}
                <TabNav>
                    <TabButton
                        active={activeTab === 'login'}
                        onClick={() => setActiveTab('login')}
                    >
                        LOGIN
                    </TabButton>
                    <TabButton
                        active={activeTab === 'register'}
                        onClick={() => setActiveTab('register')}
                    >
                        REGISTER
                    </TabButton>
                </TabNav>

                {/* Social Login Section */}
                <SocialConnect>
                    <p>Connect with:</p>
                    <SocialButtons>
                        <SocialButton iconColor="#3b5998" title="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </SocialButton>
                        <SocialButton iconColor="#dd4b39" title="Google">
                            <i className="fab fa-google"></i>
                        </SocialButton>
                        <SocialButton iconColor="#55acee" title="Twitter">
                            <i className="fab fa-twitter"></i>
                        </SocialButton>
                    </SocialButtons>
                </SocialConnect>

                <OrSeparator><span>or</span></OrSeparator>

                {/* Form Section */}
                <Form onSubmit={handleFormSubmit}>
                    <Input
                        type="email"
                        placeholder="Your E-mail or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {activeTab === 'login' && (
                        <ForgotPassword>
                            <a href="#forgot">Forgot password?</a>
                        </ForgotPassword>
                    )}

                    <SubmitButton type="submit">
                        {activeTab === 'login' ? 'SIGN IN' : 'REGISTER'}
                    </SubmitButton>
                </Form>

                {activeTab === 'login' && (
                    <MemberStatus>
                        Not a member? <span onClick={() => setActiveTab('register')}>Register</span>
                    </MemberStatus>
                )}

                {/* Close Button */}
                <CloseButton onClick={onClose}>
                    CLOSE
                </CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default LoginRegisterModal;