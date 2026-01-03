import React from 'react';

const CardModal = ({ card, onClose }) => {
    if (!card) return null;

    // Helper to get image path (duplicates logic from CardGrid but that's fine for now, or we could pass the computed src)
    const getImagePath = (c) => {
        if (!c) return '';
        const localPath = `/cards/${c.id.replace(/[^a-zA-Z0-9-_]/g, '_')}.png`;
        return localPath;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900 rounded-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700"
                onClick={e => e.stopPropagation()} // Prevent close on content click
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 bg-black/50 flex items-center justify-center p-8">
                    <img
                        src={getImagePath(card)}
                        onError={(e) => {
                            if (card.imageUrl && card.imageUrl.startsWith('http')) e.target.src = card.imageUrl;
                        }}
                        alt={card.name}
                        className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
                    />
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{card.cardSet}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${card.color === 'Red' ? 'border-red-500 text-red-400' :
                                card.color === 'Blue' ? 'border-blue-500 text-blue-400' :
                                    card.color === 'Green' ? 'border-green-500 text-green-400' :
                                        card.color === 'Purple' ? 'border-purple-500 text-purple-400' :
                                            card.color === 'Black' ? 'border-gray-500 text-gray-400' :
                                                card.color === 'Yellow' ? 'border-yellow-500 text-yellow-400' :
                                                    'border-gray-500 text-gray-400'
                                }`}>
                                {card.color}
                            </span>
                            <span className="text-gray-400 text-sm">{card.rarity}</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-1">{card.name}</h2>
                        <div className="text-gray-400 text-sm font-mono">{card.id}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase">Type</div>
                            <div className="font-semibold text-gray-200">{card.type}</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase">Category</div>
                            <div className="font-semibold text-gray-200">{card.category}</div>
                        </div>
                        {(card.power && card.power !== '-') && (
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Power</div>
                                <div className="font-semibold text-gray-200">{card.power}</div>
                            </div>
                        )}
                        {(card.counter && card.counter !== '-') && (
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Counter</div>
                                <div className="font-semibold text-gray-200">{card.counter}</div>
                            </div>
                        )}
                        {(card.cost && card.cost !== '-') && (
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Cost</div>
                                <div className="font-semibold text-gray-200">{card.cost}</div>
                            </div>
                        )}
                        {(card.attribute && card.attribute !== '-') && (
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase">Attribute</div>
                                <div className="font-semibold text-gray-200">{card.attribute}</div>
                            </div>
                        )}
                    </div>

                    {card.effect && (
                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex-grow">
                            <h3 className="text-lg font-bold text-gray-300 mb-2">Effect</h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{card.effect}</p>
                        </div>
                    )}
                    {card.trigger && (
                        <div className="bg-yellow-900/20 p-6 rounded-lg border border-yellow-700/50 flex-grow mt-4">
                            <h3 className="text-lg font-bold text-yellow-500 mb-2">Trigger</h3>
                            <p className="text-yellow-100 leading-relaxed whitespace-pre-wrap">{card.trigger}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardModal;
