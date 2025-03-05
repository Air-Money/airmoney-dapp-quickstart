import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Connection,
    VersionedTransaction,
    clusterApiUrl
} from '@solana/web3.js';
import { Buffer } from 'buffer';

const JUP_BASE_URL = import.meta.env.VITE_JUP_BASE_URL || 'https://quote-api.jup.ag/v4';
const JUP_QUOTE_ENDPOINT = `${JUP_BASE_URL}/quote`;
const JUP_SWAP_ENDPOINT = `${JUP_BASE_URL}/swap`;

const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
const connection = new Connection(RPC_URL, 'confirmed');

const SOL_DECIMALS = 1000000000;

const BIRDEYE_API_KEY = import.meta.env.VITE_BIRDEYE_API_KEY;

function App() {
    const [tokens, setTokens] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const wsRef = useRef(null);
    const [isWsOpen, setIsWsOpen] = useState(false);
    const [subPriceData, setSubPriceData] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [amount, setAmount] = useState(5);
    const [scrollDelta, setScrollDelta] = useState(0);
    const [highlightPrice, setHighlightPrice] = useState(false);
    const [detail, setDetail] = useState({ holder: 0, market: 0 });
    const [offset, setOffset] = useState(1);
    const [apeLoading, setApeLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        async function setImages() {
            try {
                await fetch("http://127.0.0.1:4040", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        method: "setImage",
                        params: ["back.png", "left"],
                        id: 1
                    })
                });

                await fetch("http://127.0.0.1:4040", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        method: "setImage",
                        params: ["quick_buy.png", "right"],
                        id: 1
                    })
                });
            } catch (err) {
                console.error("Error setting images:", err);
            }
        }
        setImages();
    }, []);

    useEffect(() => {
        const ws = new WebSocket(
            `wss://public-api.birdeye.so/socket/solana?x-api-key=${BIRDEYE_API_KEY}`,
            'echo-protocol'
        );
        wsRef.current = ws;

        ws.onopen = () => {
            setIsWsOpen(true);
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'PRICE_DATA') {
                    setSubPriceData(msg.data);
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onclose = () => {
            setIsWsOpen(false);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const fetchTokens = useCallback(async (theOffset) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=${theOffset}&limit=20`,
                {
                    headers: {
                        'X-API-KEY': BIRDEYE_API_KEY,
                        accept: 'application/json',
                        'x-chain': 'solana',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Error fetching tokens: ${response.status}`);
            }
            const data = await response.json();
            const newTokens = data?.data?.tokens || [];

            if (!newTokens.length) {
                setOffset(1);
                setCurrentIndex(0);
            } else {
                setTokens(newTokens);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTokens(offset);
    }, [offset, fetchTokens]);

    useEffect(() => {
        if (!wsRef.current || !isWsOpen || !tokens.length) return;

        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'UNSUBSCRIBE_PRICE' }));
        }

        const currentToken = tokens[currentIndex];
        if (!currentToken?.address) return;

        setSubPriceData(null);

        if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: 'SUBSCRIBE_PRICE',
                    data: {
                        queryType: 'simple',
                        chartType: '1m',
                        address: currentToken.address,
                        currency: 'usd',
                    },
                })
            );
        }
    }, [tokens, currentIndex, isWsOpen]);

    useEffect(() => {
        const currentToken = tokens[currentIndex];
        if (!currentToken?.address) return;

        async function fetchDetails() {
            try {
                const resp = await fetch(
                    `https://public-api.birdeye.so/defi/v3/token/trade-data/single?address=${currentToken.address}`,
                    {
                        headers: {
                            'X-API-KEY': BIRDEYE_API_KEY,
                            accept: 'application/json',
                            'x-chain': 'solana',
                        }
                    }
                );
                if (!resp.ok) {
                    throw new Error(`Detail fetch error: ${resp.status}`);
                }
                const detailData = await resp.json();
                setDetail({
                    holder: detailData.data?.holder ?? 0,
                    market: detailData.data?.market ?? 0
                });
            } catch (e) {
                console.error(e);
                setDetail({ holder: 0, market: 0 });
            }
        }
        fetchDetails();
    }, [tokens, currentIndex]);

    useEffect(() => {
        if (subPriceData) {
            setHighlightPrice(true);
            const timer = setTimeout(() => setHighlightPrice(false), 700);
            return () => clearTimeout(timer);
        }
    }, [subPriceData]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                setIsFocused((prev) => !prev);
                return;
            }

            if (e.key === 'ArrowLeft') {
                window.location.href = 'http://localhost/';
                return;
            }

            if (e.key === 'ArrowRight') {
                const currentToken = tokens[currentIndex];
                if (currentToken?.address && !apeLoading) {
                    handleApe(currentToken);
                }
                return;
            }

            if (isFocused) {
                if (e.key === '[') {
                    setAmount((prev) => {
                        const newVal = Math.max(0.1, prev - 0.1);
                        return parseFloat(newVal.toFixed(1));
                    });
                }
                if (e.key === ']') {
                    setAmount((prev) => {
                        const newVal = prev + 0.1;
                        return parseFloat(newVal.toFixed(1));
                    });
                }
            } else {
                if (!tokens.length) return;
                if (e.key === '[') {
                    setScrollDelta((prev) => prev - 1);
                }
                if (e.key === ']') {
                    setScrollDelta((prev) => prev + 1);
                }
            }
        },
        [tokens, isFocused, currentIndex, apeLoading]
    );

    useEffect(() => {
        if (scrollDelta >= 1) {
            if (currentIndex >= tokens.length - 1) {
                setOffset((prevOffset) => prevOffset + 20);
                setCurrentIndex(0);
            } else {
                setCurrentIndex((prevIndex) =>
                    prevIndex < tokens.length - 1 ? prevIndex + 1 : prevIndex
                );
            }
            setScrollDelta(0);
        } else if (scrollDelta <= -1) {
            if (currentIndex > 0) {
                setCurrentIndex((prevIndex) => prevIndex - 1);
            } else {
                setCurrentIndex(tokens.length - 1);
            }
            setScrollDelta(0);
        }
    }, [scrollDelta, tokens.length, currentIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleAmountChange = (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0.1) {
            setAmount(parseFloat(val.toFixed(1)));
        } else {
            setAmount(0.1);
        }
    };

    const handleApe = async (item) => {
        setApeLoading(true);
        try {
            const rawBuyAmount = parseFloat(amount);
            if (isNaN(rawBuyAmount) || rawBuyAmount <= 0) {
                setNotification({
                    type: 'error',
                    message: 'Invalid USDC amount. Transaction aborted.'
                });
                setTimeout(() => setNotification(null), 3000);
                return;
            }

            const walletsResp = await fetch("http://127.0.0.1:4040", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "getSvmWallets",
                    params: [],
                    id: 1
                })
            });
            const walletsData = await walletsResp.json();
            const wallets = walletsData.result || [];
            if (!wallets.length) {
                setNotification({
                    type: 'error',
                    message: 'No wallets available from sign server.'
                });
                setTimeout(() => setNotification(null), 3000);
                return;
            }
            const fromWallet = wallets[0];
            console.log("Using wallet:", fromWallet);

            const buyLamports = Math.floor(amount * 1_000_000);

            console.log("Swapping in backend with jupiterSwap method...");
            const swapRpcResp = await fetch("http://127.0.0.1:4040", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "jupiterSwap",
                    params: [
                        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        item.address,
                        fromWallet,
                        buyLamports
                    ],
                    id: 1
                })
            });
            const swapRpcData = await swapRpcResp.json();
            if (swapRpcData.error) {
                setNotification({
                    type: 'error',
                    message: `Swap failed: ${swapRpcData.error.message}`
                });
                setTimeout(() => setNotification(null), 3000);
                return;
            }

            if (!swapRpcData.result) {
                setNotification({
                    type: 'error',
                    message: 'No tx hash returned from jupiterSwap'
                });
                setTimeout(() => setNotification(null), 3000);
            } else {
                const txHash = swapRpcData.result;
                console.log("Swap successful! TX:", txHash);
                setNotification({
                    type: 'success',
                    message: `Swap successful! TX: ${txHash}`
                });
                setTimeout(() => setNotification(null), 3000);
            }

        } catch (err) {
            console.error('Error in handleApe:', err);
            setNotification({
                type: 'error',
                message: `Transaction failed: ${err}`
            });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setApeLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <h1>Loading...</h1>
            </div>
        );
    }

    const currentToken = tokens[currentIndex] || {};
    const finalPrice =
        subPriceData?.c != null
            ? subPriceData.c.toFixed(6)
            : currentToken.price
                ? parseFloat(currentToken.price).toFixed(6)
                : '—';
    const liquidityStr = formatNumber(currentToken.liquidity);
    const volumeStr = formatNumber(currentToken.volume24hUSD);

    return (
        <div style={styles.container}>
            {notification && (
                <div
                    style={
                        notification.type === 'success'
                            ? styles.notificationSuccess
                            : styles.notificationError
                    }
                >
                    {notification.message}
                </div>
            )}

            {currentToken.address ? (
                <>
                    <div style={styles.leftSide}>
                        <div style={styles.addressOverlay}>
                            {shortenAddress(currentToken.address)}
                        </div>
                        <img
                            src={currentToken.logoURI ?? ''}
                            alt={currentToken.symbol}
                            style={styles.tokenImage}
                        />
                    </div>
                    <div style={styles.rightSide}>
                        <h2 style={styles.tokenName} title={currentToken.name}>
                            {currentToken.name}
                        </h2>
                        <h3 style={styles.tokenSymbol}>({currentToken.symbol})</h3>
                        <div style={highlightPrice ? {
                            ...styles.priceDisplay,
                            transform: 'scale(1.1)',
                            transition: 'transform 0.1s ease'
                        } : styles.priceDisplay}>
                            ${finalPrice}
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Liquidity:</span>
                            <span style={styles.infoValue}>${liquidityStr}</span>
                        </div>
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>24h Volume:</span>
                            <span style={styles.infoValue}>${volumeStr}</span>
                        </div>
                        <div style={styles.amountSection}>
                            <div style={styles.amountRow}>
                                <div style={styles.amountLeft}>
                                    <label style={styles.amountLabel}>Amount:</label>
                                    <small style={styles.amountHint}>Press knob to set</small>
                                </div>
                                <div style={styles.amountRight}>
                                    <input
                                        style={isFocused ? styles.amountInputFocus : styles.amountInput}
                                        value={amount}
                                        readOnly={!isFocused}
                                        onChange={handleAmountChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={styles.bottomInfo}>
                            <div style={styles.holderInfo}>
                                <i className="fas fa-user fa-lg" style={{ marginRight: '4px', color: 'orange' }}></i>
                                &nbsp;{detail.holder?.toLocaleString() ?? 0}
                            </div>
                            <div style={styles.marketInfo}>
                                <i className="fas fa-tint fa-lg" style={{ marginRight: '4px', color: 'orange' }}></i>
                                &nbsp;{detail.market?.toLocaleString() ?? 0}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <h2 style={{ color: '#fff' }}>No tokens found</h2>
            )}

            {apeLoading && (
                <div style={styles.swapOverlay}>
                    <div style={styles.swapOverlayContent}>
                        <h2>Swapping tokens...</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

function shortenAddress(addr) {
    if (!addr || addr.length < 8) return addr || '';
    return addr.slice(0, 4) + '...' + addr.slice(-4);
}

function formatNumber(value) {
    if (!value || isNaN(value)) return '—';
    const absValue = Math.abs(value);

    if (absValue < 1e3) {
        return value.toFixed(1);
    } else if (absValue < 1e6) {
        return (value / 1e3).toFixed(1) + 'k';
    } else if (absValue < 1e9) {
        return (value / 1e6).toFixed(1) + 'M';
    } else if (absValue < 1e12) {
        return (value / 1e9).toFixed(1) + 'B';
    } else {
        return (value / 1e12).toFixed(1) + 'T';
    }
}

const styles = {
    loadingScreen: {
        width: '800px',
        height: '480px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'sans-serif',
        fontSize: '24px'
    },
    container: {
        width: '800px',
        height: '480px',
        display: 'flex',
        fontFamily: 'sans-serif',
        overflow: 'hidden',
        backgroundColor: '#000',
        transition: 'transform 0.3s ease',
        position: 'relative'
    },
    leftSide: {
        width: '480px',
        height: '480px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        position: 'relative'
    },
    addressOverlay: {
        position: 'absolute',
        top: '30px',
        left: '30px',
        backgroundColor: '#000',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 1
    },
    tokenImage: {
        width: '90%',
        height: '90%',
        objectFit: 'cover',
        borderRadius: '20px',
        margin: '10px',
        padding: '10px'
    },
    rightSide: {
        width: '320px',
        height: '480px',
        overflow: 'auto',
        backgroundColor: '#000',
        padding: '20px',
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column'
    },
    tokenName: {
        margin: 0,
        fontSize: '30px',
        color: '#ffffff',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxHeight: '65px'
    },
    tokenSymbol: {
        marginTop: 5,
        marginBottom: 20,
        fontSize: '24px',
        color: '#e88e12'
    },
    priceDisplay: {
        fontSize: '48px',
        color: '#fff',
        textAlign: 'center',
        margin: '20px 0'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '12px 0',
        fontSize: '20px',
        transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#fff'
    },
    infoValue: {
        marginLeft: 10,
        color: '#fff'
    },
    amountSection: {
        marginTop: 20,
    },
    amountRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    amountLeft: {
        display: 'flex',
        flexDirection: 'column'
    },
    amountLabel: {
        color: '#fff',
        fontSize: '16px',
        marginBottom: '4px'
    },
    amountHint: {
        color: '#aaa',
        fontSize: '12px'
    },
    amountRight: {
        flexGrow: 1,
        textAlign: 'right'
    },
    amountInput: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '18px',
        border: 'none',
        outline: 'none',
        width: '80px'
    },
    amountInputFocus: {
        backgroundColor: '#333',
        color: 'limegreen',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '24px',
        border: 'none',
        outline: 'none',
        width: '80px'
    },
    bottomInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '50px'
    },
    holderInfo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        color: '#e88e12'
    },
    marketInfo: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        color: '#e88e12'
    },
    notificationSuccess: {
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#4caf50',
        padding: '10px 20px',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '16px',
        zIndex: 10000
    },
    notificationError: {
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#f44336',
        padding: '10px 20px',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '16px',
        zIndex: 10000
    },
    swapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '800px',
        height: '480px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9998,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    swapOverlayContent: {
        color: '#ffffff',
        fontSize: '24px'
    }
};
export default App;
