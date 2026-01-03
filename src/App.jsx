import React, { useState, useEffect } from 'react';
import CardGrid from './components/CardGrid';
import { generateBox, generatePrerelease } from './utils/packLogic';
// Import JSON directly if valid, or fetch it.
// Vite allows importing JSON.
import cardData from './data/one_piece_cards.json';

import CardModal from './components/CardModal';

function App() {
    const [cards, setCards] = useState([]);
    const [stats, setStats] = useState({ hits: 0, srs: 0 });
    const [mode, setMode] = useState(''); // 'BOX' or 'PRERELEASE'
    const [notification, setNotification] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);

    // Load card data check
    useEffect(() => {
        if (!cardData || cardData.length === 0) {
            console.error("No card data found in one_piece_cards.json");
        }
    }, []);

    const calculateStats = (drawnCards) => {
        let hits = 0;
        let srs = 0;

        drawnCards.forEach(card => {
            const isAA = card.id.includes('_p') || card.id.endsWith('*');
            const isSEC = card.rarity === 'SEC';
            const isSP = card.rarity === 'TR' || card.rarity === 'SP'; // Treasure Rare or SP
            const isSR = card.rarity === 'SR';

            if (isAA || isSEC || isSP) {
                hits++;
            } else if (isSR) {
                srs++;
            }
        });
        return { hits, srs };
    };

    const handleOpenBox = () => {
        const newCards = generateBox(cardData);
        setCards(newCards);
        setStats(calculateStats(newCards));
        setMode('BOX');
        setNotification('Abiertos 24 Packs (Caja Completa)!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleOpenPrerelease = () => {
        const newCards = generatePrerelease(cardData);
        setCards(newCards);
        setStats(calculateStats(newCards));
        setMode('PRERELEASE');
        setNotification('Abiertos 6 Packs (Prerelease)!');
        setTimeout(() => setNotification(''), 3000);
    };

    const handleCopyDecklist = () => {
        if (cards.length === 0) return;

        // Group cards by base id removing _pN suffix (e.g. OP14-001_p1 -> OP14-001)
        const counts = {};
        cards.forEach(card => {
            const rawId = card.id;
            const baseId = rawId.replace(/_p\d+$/i, ''); // elimina sufijos _pN al final
            counts[baseId] = (counts[baseId] || 0) + 1;
        });

        const lines = Object.entries(counts).map(([id, count]) => `${count}x${id}`);
        const clipboardText = lines.join('\n');

        navigator.clipboard.writeText(clipboardText).then(() => {
            setNotification('Decklist copied to clipboard!');
            setTimeout(() => setNotification(''), 3000);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 font-sans text-gray-100">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-700 pb-6">
                    <h1 className="text-4xl font-extrabold text-blue-400">
                        Prerelease Sim<br /> OP14 - EB04
                    </h1>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleOpenBox}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-900/50"
                        >
                            Abrir 24 Sobres (Caja Completa)
                        </button>
                        <button
                            onClick={handleOpenPrerelease}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors shadow-lg shadow-purple-900/50"
                        >
                            Simular Prerelease (6 Sobres)
                        </button>
                        {cards.length > 0 && (
                            <button
                                onClick={handleCopyDecklist}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors shadow-lg shadow-green-900/50"
                            >
                                Copy Decklist
                            </button>
                        )}
                    </div>
                </header>

                {notification && (
                    <div className="fixed top-4 right-4 bg-gray-800 border border-gray-600 px-6 py-3 rounded-md shadow-xl z-50 animate-fade-in-down">
                        {notification}
                    </div>
                )}

                <main>
                    {cards.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">Select a mode above to open packs!</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Bar */}
                            {/* <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-6 items-center shadow-lg border border-gray-700">
                                <span className="text-lg font-semibold text-gray-300">Run Statistics:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 font-bold text-xl">{stats.hits}</span>
                                    <span className="text-sm text-gray-400 uppercase tracking-wider">Hits (AA/SEC/SP)</span>
                                </div>
                                <div className="w-px h-8 bg-gray-600"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-400 font-bold text-xl">{stats.srs}</span>
                                    <span className="text-sm text-gray-400 uppercase tracking-wider">SRs</span>
                                </div>
                            </div> */}

                            <CardGrid
                                cards={cards.sort((a, b) => a.id.localeCompare(b.id))}
                                title={mode === 'BOX' ? 'Contenido de la Caja' : 'Pool de Prerelease'}
                                onClick={setSelectedCard}
                            />
                        </>
                    )}
                </main>

                <CardModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            </div>
        </div>
    );
}

export default App;
