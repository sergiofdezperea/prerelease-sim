import React from 'react';

const CardGrid = ({ cards, title, onClick }) => {
    if (!cards || cards.length === 0) return null;

    return (
        <div className="mb-8 p-4">
            <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-700 pb-2">
                {title} ({cards.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {cards.map((card, index) => {
                    const isShiny = ['SR', 'SEC', 'SP', 'TR'].includes(card.rarity) || card.id.endsWith('*') || card.id.includes('_p');
                    const isAA = card.id.endsWith('*') || card.id.includes('_p');

                    return (
                        <div
                            key={`${card.id}-${index}`}
                            onClick={() => onClick && onClick(card)}
                            className={`relative transition-transform hover:scale-105 duration-200 rounded-lg overflow-hidden group cursor-pointer
                ${isShiny ? 'ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : ''}
                ${isAA ? 'ring-2 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : ''}
              `}
                        >
                            {/* Use local image path. Sanitize ID just in case to match script logic */}
                            <img
                                src={`/cards/${card.id.replace(/[^a-zA-Z0-9-_]/g, '_')}.png`}
                                onError={(e) => {
                                    // Fallback to remote if local fails (and if remote is absolute)
                                    if (card.imageUrl && card.imageUrl.startsWith('http')) e.target.src = card.imageUrl;
                                }}
                                alt={card.name}
                                className="w-full h-auto object-cover rounded-md"
                                loading="lazy"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {card.id} - {card.rarity}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardGrid;
