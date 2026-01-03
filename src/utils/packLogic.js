// packLogic.js

// Constants
const PACK_SIZE = 12;
const PACKS_PER_BOX = 24;
const PRERELEASE_PACKS = 6;

// Rarity Definitions
const RARITY = {
    COMMON: 'C',
    UNCOMMON: 'UC',
    RARE: 'R',
    SUPER_RARE: 'SR',
    SECRET_RARE: 'SEC',
    LEADER: 'L'
};

/**
 * Filter cards by set (OP14, EB04)
 */
export const filterCardsBySet = (allCards) => {
    if (!allCards) return [];
    // Adjust filter logic based on actual Set Names in JSON. 
    // For now assuming strings like "OP14", "EB04" are present in card.cardSet or card.id
    return allCards.filter(card => {
        // Check ID prefix or set name
        const id = card.id || '';
        const set = card.cardSet || '';
        return id.startsWith('OP14') || id.startsWith('EB04') ||
            set.includes('OP14') || set.includes('EB04');
    });
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Select N random cards from a specific pool (without replacement if possible, else with)
 */
const selectRandomCards = (pool, count) => {
    const selected = [];
    const _pool = [...pool];
    for (let i = 0; i < count; i++) {
        if (_pool.length === 0) break;
        const idx = getRandomInt(0, _pool.length - 1);
        selected.push(_pool[idx]);
        _pool.splice(idx, 1);
    }
    return selected;
};

/**
 * Get randomness helper
 */
const draw = (pool) => pool[Math.floor(Math.random() * pool.length)];

/**
 * GENERATE 24-PACK BOX POOL
 */
export const generateBox = (allCards) => {
    const filtered = filterCardsBySet(allCards);

    // Helper to identify Alt Arts (AAs)
    // Assumption: AAs end with * or _p or _pX.
    const isAA = (c) => c.id.includes('_p') || c.id.endsWith('*');

    // Categorize - EXCLUDING Alt Arts for standard pools
    const commons = filtered.filter(c => c.rarity.includes('C') && !c.rarity.includes('SEC') && !c.rarity.includes('UC') && !isAA(c));
    const uncommons = filtered.filter(c => c.rarity.includes('UC') && !isAA(c));
    const rares = filtered.filter(c => c.rarity === 'R' && !isAA(c));
    const superRares = filtered.filter(c => c.rarity === 'SR' && !isAA(c));
    const secretRares = filtered.filter(c => c.rarity === 'SEC' && !isAA(c));
    const leaders = filtered.filter(c => c.rarity === 'L' && !isAA(c));

    // Hit Pool includes ALL AAs (SR AA, SEC AA, L AA, R AA, SP, TR) + Regular SECs
    const hitPool = filtered.filter(c => isAA(c) || c.rarity === 'SEC' || c.rarity === 'TR' || c.rarity === 'SP');

    // 1. POOL A: 24 Cards (Slot 12)
    const poolA = [];

    // 1 SEC (guaranteed 1 SEC or AA slot usually, but let's stick to user prompt Plan: 1 SEC, 1 AA, 7 SR)
    // Actually, "1 SEC, 1 AA" usually implies 1 high rarity hit and 1 Alt Art hit.
    if (secretRares.length > 0) poolA.push(draw(secretRares));

    // 7 SRs (Regular)
    const srsToTake = selectRandomCards(superRares, 7);
    poolA.push(...srsToTake);

    // 1 AA
    if (hitPool.length > 0) poolA.push(draw(hitPool));
    else poolA.push(draw(superRares)); // Fallback

    // Rest Rares to fill 24
    const raresNeededA = 24 - poolA.length;
    poolA.push(...selectRandomCards(rares, raresNeededA));

    // 2. POOL B: 24 Cards (Slot 11) - Leader Slot
    const poolB = [];
    const leadersToTake = selectRandomCards(leaders, 7);
    poolB.push(...leadersToTake);

    const raresNeededB = 24 - poolB.length;
    // We need distinct rares from Pool A? Ideally yes, but card game logic allows dups across boxes often.
    // We'll just draw from main rare pool again.
    poolB.push(...selectRandomCards(rares, raresNeededB));

    // 3. POOL C: C/UC
    // We need 168 Commons (7 per pack * 24)
    // We need 72 Uncommons (3 per pack * 24)
    // Simple approach: Iterate 24 times, grab 7C + 3UC.

    const packs = [];

    // Shuffle categories
    const shuffledPoolA = poolA.sort(() => .5 - Math.random());
    const shuffledPoolB = poolB.sort(() => .5 - Math.random());

    for (let i = 0; i < 24; i++) {
        const packCommons = selectRandomCards(commons, 7);
        const packUncommons = selectRandomCards(uncommons, 3);
        const slot11 = shuffledPoolB[i];
        const slot12 = shuffledPoolA[i];

        // Assemble Pack: 7C, 3UC, Slot11, Slot12
        const pack = [...packCommons, ...packUncommons, slot11, slot12];
        packs.push(pack);
    }

    return packs.flat();
};

/**
 * GENERATE PRERELEASE (6 Packs, 2-2-2)
 */
export const generatePrerelease = (allCards) => {
    const filtered = filterCardsBySet(allCards);
    const isAA = (c) => c.id.includes('_p') || c.id.endsWith('*');

    // Strict Base Pools (No AAs)
    const commons = filtered.filter(c => c.rarity.includes('C') && !c.rarity.includes('SEC') && !c.rarity.includes('UC') && !isAA(c));
    const uncommons = filtered.filter(c => c.rarity.includes('UC') && !isAA(c));
    const leaders = filtered.filter(c => c.rarity === 'L' && !isAA(c));
    const rares = filtered.filter(c => c.rarity === 'R' && !isAA(c));
    const regularSRs = filtered.filter(c => c.rarity === 'SR' && !isAA(c));

    // Upgrade Pool (SECs, AAs, SPs)
    const upgradePool = filtered.filter(c => isAA(c) || c.rarity === 'SEC' || c.rarity === 'TR' || c.rarity === 'SP');

    const packs = [];

    // Helper: Logic for a "Rare" slot that has a small chance to be a Hit/SR
    // To allow "up to 3 hits with luck", we give other packs a small chance to upgrade.
    const getPossibleHitSlot = (defaultRate = 0.0) => {
        const roll = Math.random();
        // User said "With much luck 6 packs could have 3 hits".
        // Hit Packs already provide 2 chances for SR/Hits.
        // We need a small chance in the other 4 packs to provide that 3rd hit.
        // Let's say 5% chance per pack to upgrade a Rare to an SR/Hit.
        if (roll < defaultRate && (upgradePool.length > 0 || regularSRs.length > 0)) {
            // If upgrading, use Hit Slot logic (30% Hit, 70% SR)
            const upgradeRoll = Math.random();
            if (upgradeRoll < 0.3 && upgradePool.length > 0) return draw(upgradePool);
            return draw(regularSRs) || draw(rares);
        }
        return draw(rares);
    };

    // Helper: Slot 12 Logic for "Hit Pack" (Guaranteed Rare+ slot, weighted)
    const getHitSlotCard = () => {
        const roll = Math.random();
        if (roll < 0.33 && upgradePool.length > 0) {
            return draw(upgradePool);
        } else {
            return draw(regularSRs) || draw(rares);
        }
    };

    // 1. Two Leader Packs
    // Structure: 7 C, 2 UC, 1 L, 2 R (1 R has 5% upgrade chance)
    for (let i = 0; i < 2; i++) {
        packs.push([
            ...selectRandomCards(commons, 7),
            ...selectRandomCards(uncommons, 2),
            draw(leaders) || draw(commons),
            draw(rares),
            getPossibleHitSlot(0.05) // 5% chance to be SR/Hit instead of 2nd Rare
        ]);
    }

    // 2. Two Double Rare Packs
    // Structure: 7 C, 3 UC, 2 R (1 R has 5% upgrade chance)
    for (let i = 0; i < 2; i++) {
        packs.push([
            ...selectRandomCards(commons, 7),
            ...selectRandomCards(uncommons, 3),
            draw(rares),
            getPossibleHitSlot(0.05)
        ]);
    }

    // 3. Two Hit Packs
    // Structure: 7 C, 3 UC, 1 R, 1 Hit (Weighted)
    for (let i = 0; i < 2; i++) {
        packs.push([
            ...selectRandomCards(commons, 7),
            ...selectRandomCards(uncommons, 3),
            draw(rares),
            getHitSlotCard()
        ]);
    }

    return packs.flat();
};
