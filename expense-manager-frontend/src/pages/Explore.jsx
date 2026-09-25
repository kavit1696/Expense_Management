import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashImg from '../assets/First.png';
import formImg from '../assets/Second.jpeg';
import catImg from '../assets/Third.jpeg';
import { LogIn, ArrowRight, PieChart, TrendingUp, TrendingDown, ShieldCheck, Folder, Layers, FileText } from 'lucide-react';
import Login from './Login';

const Explore = () => {
    const navigate = useNavigate();
    const images = [dashImg, formImg, catImg];
    const [currentImage, setCurrentImage] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes gradientShift {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    <div className="logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>E</div>
                    <span style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-main)' }}>ExpenseManager</span>
                </div>
                <button className="btn btn-primary" style={styles.signInBtn} onClick={() => setShowLogin(true)}>
                    <LogIn size={18} style={{ marginRight: '8px' }} />
                    Sign In / Log In
                </button>
            </header>

            {/* Hero Section */}
            <main style={styles.main}>
                <div style={styles.heroText}>
                    <p style={styles.eyebrow}>Expense Manager</p>
                    <h1 style={styles.title}>Finally, money stuff<br />that makes sense</h1>
                    <p style={styles.subtitle}>
                        A simple, fast, and honestly kind of nice way to track what you spend, what comes in, and where it all goes.
                    </p>
                    {!showLogin && (
                        <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '24px' }} onClick={() => setShowLogin(true)}>
                            Get Started <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                        </button>
                    )}
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '6rem', transition: 'all 0.5s ease' }}>
                    {!showLogin ? (
                        /* Carousel */
                        <div style={{ ...styles.carouselContainer, marginBottom: 0, transition: 'flex 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                            <div style={styles.carouselWrapper}>
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Feature ${idx + 1}`}
                                        style={{
                                            ...styles.carouselImage,
                                            opacity: currentImage === idx ? 1 : 0
                                        }}
                                    />
                                ))}
                            </div>
                            <div style={styles.dots}>
                                {images.map((_, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            ...styles.dot,
                                            background: currentImage === idx ? 'var(--primary)' : 'rgba(255,255,255,0.3)'
                                        }}
                                        onClick={() => setCurrentImage(idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Sign-in Page inline rendering */
                        <div className="explore-login-anim" style={{ width: '100%', maxWidth: '450px', flexShrink: 0 }}>
                            <Login embedded={true} />
                        </div>
                    )}
                </div>

                {/* Features Guide */}
                <div style={styles.featuresSection}>
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem', color: 'white' }}>Features</h2>
                    <div style={styles.featuresGrid}>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(10, 132, 255, 0.2)', color: 'var(--primary, #0a84ff)' }}>
                                <PieChart size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Intuitive Dashboard</h3>
                            <p style={styles.featureText}>Gain immediate insights with interactive charts displaying your financial overview at a glance.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(255, 69, 58, 0.2)', color: '#ff453a' }}>
                                <TrendingDown size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Expense Tracking</h3>
                            <p style={styles.featureText}>Log and monitor your daily expenses effortlessly to keep your spending habits in check.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(50, 215, 75, 0.2)', color: 'var(--success, #32d74b)' }}>
                                <TrendingUp size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Income Management</h3>
                            <p style={styles.featureText}>Record various income streams to understand your total earnings and financial growth.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(255, 159, 10, 0.2)', color: 'var(--warning, #ff9f0a)' }}>
                                <Folder size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Project Budgets</h3>
                            <p style={styles.featureText}>Group transactions into specific projects to manage budgets for events or business.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(191, 90, 242, 0.2)', color: '#bf5af2' }}>
                                <Layers size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Smart Categories</h3>
                            <p style={styles.featureText}>Organize your finances with customizable categories and subcategories for precise tracking.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={{ ...styles.featureIcon, background: 'rgba(21, 208, 171, 0.2)', color: '#15d0ab' }}>
                                <FileText size={28} />
                            </div>
                            <h3 style={styles.featureTitle}>Detailed Reports</h3>
                            <p style={styles.featureText}>Generate comprehensive reports to analyze spending patterns across any time period.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-body)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-stack)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 3rem',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    signInBtn: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,
        borderRadius: '10px',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
    },
    heroText: {
        textAlign: 'center',
        maxWidth: '800px',
        marginBottom: '5rem',
    },
    eyebrow: {
        display: 'inline-block',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--primary)',
        background: 'var(--primary-light)',
        borderRadius: '999px',
        padding: '6px 20px',
        marginBottom: '1.5rem',
    },
    title: {
        fontSize: '4.5rem',
        fontWeight: 800,
        color: 'var(--text-main)',
        marginBottom: '1.75rem',
        lineHeight: 1.1,
        letterSpacing: '-0.04em',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
        fontWeight: 400,
        lineHeight: 1.6,
        marginBottom: '2.5rem',
        maxWidth: '560px',
        margin: '0 auto 2.5rem',
    },
    carouselContainer: {
        width: '100%',
        maxWidth: '1400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    carouselWrapper: {
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        background: '#fff',
        position: 'relative',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'top center',
        position: 'absolute',
        top: 0,
        left: 0,
        transition: 'opacity 0.8s ease-in-out',
    },
    dots: {
        display: 'flex',
        gap: '12px',
        marginTop: '2rem',
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    featuresSection: {
        width: '100%',
        marginTop: '4rem',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
    },
    featureCard: {
        background: 'var(--bg-surface)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
    },
    featureIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
    },
    featureTitle: {
        fontSize: '1.25rem',
        color: 'var(--text-main)',
        marginBottom: '1rem',
        fontWeight: 600,
    },
    featureText: {
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        fontSize: '1rem',
    }
};

export default Explore;
