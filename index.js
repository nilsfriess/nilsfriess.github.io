let currSelection = "";

let ufdata = [];

const northWest = {
    'lat': 49.910046,
    'long': 7.226884
};

const southEast = {
    'lat': 47.275870,
    'long': 10.778297
};

function showData() {
    currSelection = currSelection.trim();

    document.querySelector('.uflist').innerHTML = '';

    for (let entry of ufdata) {
        if (currSelection.length != 0 && !entry.city.includes(currSelection))
            continue;

        let htmlElem = document.createElement("div");
        htmlElem.innerHTML = `
        <div class="mb-6 rounded overflow-hidden shadow-xl">
            <div class="px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="font-bold text-xl mb-2">${entry.name}</div>
                <div class="text-sm">${entry.date}</div>
            </div>
            <div class="text-sm text-gray-500">${entry.code}</div>
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

    setTimeout(setPoints, 100);
}

function setPoints() {
    const radius = 5;

    document.querySelector("#dots").innerHTML = '';

    const image = document.querySelector('img');
    const pixelsPerLat = image.clientHeight / (northWest.lat - southEast.lat);
    const pixelsPerLong = image.clientWidth / (southEast.long - northWest.long);

    for (let city of ufdata) {
        if ((city.location.lat > northWest.lat || city.location.lat < southEast.lat) || (city.location.lng < northWest.long || city.location.lng > southEast.long))
            continue;

        // Insert circle
        let newDot = document.createElement("div");
        newDot.classList.add("circle");
        newDot.style.width = `${2 * radius}px`;
        newDot.style.height = `${2 * radius}px`;

        const x = ((city.location.lng - northWest.long) * pixelsPerLong);
        const y = (-1 * (city.location.lat - northWest.lat) * pixelsPerLat);

        if (x < 0 || x > image.clientWidth)
            continue;
        if (y < 0 || y > image.clientHeight)
            continue;

        // Compute relative position within image
        newDot.style.left = `${x}px`;
        newDot.style.top = `${y}px`;

        newDot.addEventListener('click', () => {
            currSelection = city.city;
            document.querySelector('#search').value = currSelection;
            showData();
        });

        newDot.addEventListener('mouseover', () => {
            document.querySelector('#selectedcity').innerHTML = city.city;
        });

        document.querySelector("#dots").appendChild(newDot);
    }
}

window.onload = function () {
    fetch('/output.json')
        .then((response) => response.json())
        .then((data) => {
            ufdata = data;
            showData();
        });

    document.querySelector('img').addEventListener('mousemove', () => {
        document.querySelector('#selectedcity').innerHTML = '';
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

    window.addEventListener('resize', () => {
        showData();
    });
}

document.querySelectorAll('#citiesmap area').forEach((areaElem) => {
    areaElem.addEventListener('click', function (e) {
        console.log("Clicked on ")
    });
});
