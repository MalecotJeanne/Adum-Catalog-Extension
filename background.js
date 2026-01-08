browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === "saveFormations") {
        const { formations } = message;
        const result = await browser.storage.local.get("formations");
        const saved = result.formations || [];

        // Filter duplicates
        const savedKeys = new Set(saved.map(f => `${f.name}|${f.place}|${f.date}`));
        const newFormations = formations.filter(f => !savedKeys.has(`${f.name}|${f.place}|${f.date}`));
        if (newFormations.length > 0) {
            await browser.storage.local.set({ formations: [...saved, ...newFormations] });
            console.log(`${newFormations.length} formations saved in background ✅`);
        }
    }
});
