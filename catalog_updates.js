function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    });
}

function scrollToTD(substring) {
    // Find all td elements
    const tds = document.querySelectorAll('td');

    // Find the td that contains an <a> whose text contains the substring
    const td = Array.from(tds).find(td =>
        Array.from(td.querySelectorAll('a')).some(a => 
            a.textContent.includes(substring)
        )
    );

    if (td) {
        td.scrollIntoView({ behavior: 'smooth', block: 'center' });
        td.style.backgroundColor = 'yellow'; // optional highlight
        td.style.transition = 'background-color 2s ease'; 

        setTimeout(() => {
            td.style.backgroundColor = 'transparent';
        }, 1000);
    } else {
        alert('TD not found!');
    }
}


async function injectDiv(newFormations) {
    const container = await waitForElm("#container");
    if (document.getElementById("newDiv")) return;

    const div = document.createElement("div");
    div.id = "newDiv";

    if (newFormations.length > 0){
        const ul = document.createElement("ul");
        newFormations.forEach(f => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = f.name;
            a.addEventListener("click", e => {
                e.preventDefault();
                scrollToTD(f.name);  // works because it’s in scope
            });
            li.appendChild(a);
            ul.appendChild(li);
        });
        if (newFormations.length > 1){
            div.innerHTML = `<h4>${newFormations.length} nouvelles formations ajoutées :</h4>`;
        } else {
            div.innerHTML = `<h4>1 nouvelle formation ajoutée :</h4>`;
        }
        div.appendChild(ul);
    } else {
        div.innerHTML = `<h4>Pas de nouvelle formation aujourd'hui :(</h4>`;
    }

    container.parentNode.insertBefore(div, container);
    console.log("Injection complete ✅");
}



async function start() {
    console.log("Waiting for tables to load...");
    
    // WAIT for at least one table to appear before scraping
    await waitForElm("table:not([class])");

    // NOW collect the data
    const tables = Array.from(document.querySelectorAll("table:not([class])"));
    let tdList = [];

    tables.forEach(table => {
        const tds = table.querySelectorAll("td:not([class])");
        tdList.push(...tds);
    });

    const textList = tdList.map(td => td.textContent.trim());

    let formations = [];
    for (let i = 0; i < textList.length; i += 6) {
        if (i + 5 >= textList.length) break;
        formations.push({
            name: textList[i],
            place: textList[i + 1],
            date: textList[i + 2],
            participation: textList[i + 3],
            state: textList[i + 4],
            places: textList[i + 5]
        });
    }

    // Now talk to storage
    const result = await browser.storage.local.get("formations");
    const saved = result.formations || [];

    const savedKeys = new Set(saved.map(f => `${f.name}|${f.place}|${f.date}`));
    const newFormations = formations.filter(f => !savedKeys.has(`${f.name}|${f.place}|${f.date}`));

    injectDiv(newFormations);
    
    try {
        await browser.storage.local.set({ formations: formations });
        console.log(`Formations saved.`);
    } catch (err) {
        console.error("Failed to save formations:", err);
    }

}

// Run the script
start();