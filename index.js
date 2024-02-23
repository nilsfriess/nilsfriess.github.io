const data = [
    {
        title: "Asperg",
        coords: {
            x: 260,
            y: 265
        }
    },
    {
        title: "Winterlingen",
        coords: {
            x: 160,
            y: 520
        }
    }
];

let currSelection = "";

let ufdata = [];

function showData() {
    currSelection = currSelection.trim();

    document.querySelector('.uflist').innerHTML = '';

    for (let entry of ufdata) {
        if(currSelection.length != 0 && !entry.city.includes(currSelection))
            continue;

        let htmlElem = document.createElement("div");
        htmlElem.innerHTML = `
        <div class="mb-6 rounded overflow-hidden shadow-xl">
            <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">${entry.name}</div>
            <p class="text-gray-700 text-base">
                ${entry.description}
            </p>
            </div>
            <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${entry.city}</span>
            </div>
        </div>`;
        document.querySelector('.uflist').appendChild(htmlElem);
    }
}

window.onload = function () {
    const radius = 10;

    for (let city of data) {
        const citiesMapElem = document.querySelector("#citiesmap");

        let newAreaElem = document.createElement("area");
        newAreaElem.title = city.title;
        newAreaElem.coords = city.coords.x + "," + city.coords.y + "," + radius;
        newAreaElem.href = "#"
        newAreaElem.shape = "circle";

        newAreaElem.addEventListener('click', () => {
            // Open popup with city title
            currSelection = city.title;
            document.querySelector('#search').value = currSelection;
            showData();
        });

        let createdElem = citiesMapElem.appendChild(newAreaElem);

        // Insert circle
        let newDot = document.createElement("div");
        newDot.classList.add("circle");
        newDot.style.width = `${2 * radius}px`;
        newDot.style.height = `${2 * radius}px`;
        newDot.style.left = parseInt(city.coords.x - radius) + "px";
        newDot.style.top = parseInt(city.coords.y - radius) + "px";

        document.querySelector("#dots").appendChild(newDot);
    }

    fetch('/output.json')
        .then((response) => response.json())
        .then((data) => {
            ufdata = data;
            showData();
        });

    document.querySelector('#search').addEventListener("input", (e) => {
        currSelection = e.target.value;
        showData();
    });

    document.querySelector("#clear").addEventListener('click', () => {
        currSelection = '';
        showData();
        document.querySelector('#search').value = currSelection;
    });
}

document.querySelectorAll('#citiesmap area').forEach((areaElem) => {
    areaElem.addEventListener('click', function (e) {
        console.log("Clicked on ")
    });
});
